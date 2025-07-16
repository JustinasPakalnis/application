provider "google" {
  project = var.project_id
  region  = "europe-west1"
}

resource "google_sql_user" "preview_user" {
  name     = "previewuser-pr-${var.pr_number}"
  instance = "postgres-db"
  password = var.database_password
}

resource "google_sql_database" "preview_db" {
  name     = "previewdb-pr-${var.pr_number}"
  instance = "postgres-db"
}


resource "google_cloud_run_v2_service" "preview" {
  name     = "preview-app-pr-${var.pr_number}"
  location = var.region

  template {
    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = ["justinas:europe-west1:postgres-db"]
      }
    }
    containers {
      image = var.docker_image_url
      startup_probe {
        period_seconds    = 30
        timeout_seconds   = 15
        failure_threshold = 10
      }
      env {
        name  = "DATABASE_URL"
        value = "postgresql://previewuser-pr-${var.pr_number}:${var.database_password}@localhost:5432/previewdb-pr-${var.pr_number}?host=/cloudsql/justinas:europe-west1:postgres-db"
      }
      resources {
        cpu_idle = true
      }
    }

  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

data "google_cloud_run_v2_service" "preview" {
  name     = google_cloud_run_v2_service.preview.name
  location = google_cloud_run_v2_service.preview.location
}

output "cloud_run_url" {
  value = data.google_cloud_run_v2_service.preview.uri
}

resource "google_cloud_run_v2_service_iam_member" "invoker" {
  location = google_cloud_run_v2_service.preview.location
  project  = google_cloud_run_v2_service.preview.project
  name     = google_cloud_run_v2_service.preview.name

  role   = "roles/run.invoker"
  member = "allUsers"
}
