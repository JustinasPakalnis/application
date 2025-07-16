provider "google" {
  credentials = file(var.credentials_path)
  project     = var.project_id
  region      = var.region
}

resource "google_sql_database_instance" "postgres-db" {
  name             = "postgres-db"
  region           = var.region
  database_version = "POSTGRES_15"

  settings {
    tier = "db-g1-small"
    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        name  = "all"
        value = var.db_ip
      }
    }
  }
}

resource "google_sql_user" "app_user" {
  name     = "remixuser"
  instance = google_sql_database_instance.postgres-db.name
  password = var.database_password
}

resource "google_sql_database" "app_db" {
  name     = "remixdb"
  instance = google_sql_database_instance.postgres-db.name
}


resource "google_cloud_run_v2_service" "remix" {
  name     = "remix-app"
  location = var.region

  template {
    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.postgres-db.connection_name]
      }
    }
    containers {
      image = var.docker_image_url

      env {
        name  = "DATABASE_URL"
        value = "postgresql://remixuser:${var.database_password}@localhost:5432/remixdb?host=/cloudsql/${google_sql_database_instance.postgres-db.connection_name}"
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
data "google_cloud_run_v2_service" "remix" {
  name     = google_cloud_run_v2_service.remix.name
  location = google_cloud_run_v2_service.remix.location
}

output "cloud_run_url" {
  value = data.google_cloud_run_v2_service.remix.uri
}

resource "google_cloud_run_v2_service_iam_member" "invoker" {
  location = google_cloud_run_v2_service.remix.location
  project  = google_cloud_run_v2_service.remix.project
  name     = google_cloud_run_v2_service.remix.name

  role   = "roles/run.invoker"
  member = "allUsers"
}
