provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_sql_database_instance" "preview-db" {
  name             = "preview-db"
  region           = var.region
  database_version = "POSTGRES_15"

  settings {
    tier = "db-g1-small"
    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        name  = "JUSTINAS!"
        value = var.db_ip
      }
    }
  }
}

resource "google_sql_user" "preview-user" {
  name     = "preview-user"
  instance = google_sql_database_instance.preview-db.name
  password = var.database_password
}

resource "google_sql_database" "preview-db" {
  name     = "preview-db"
  instance = google_sql_database_instance.preview-db.name
}


resource "google_cloud_run_v2_service" "remix" {
  name     = "app-${var.project_id}"
  location = var.region

  template {
    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.preview-db.connection_name]
      }
    }
    containers {
      image = var.docker_image_url

      env {
        name  = "DATABASE_URL"
        value = "postgresql://preview-user:${var.database_password}@localhost:5432/preview-db?host=/cloudsql/${google_sql_database_instance.preview-db.connection_name}"
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

# resource "google_cloud_run_domain_mapping" "default" {
#   location = var.region
#   name     = "jpdev.lt"

#   metadata {
#     namespace = var.project_id
#   }

#   spec {
#     route_name = google_cloud_run_v2_service.remix.name
#   }
# }

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
