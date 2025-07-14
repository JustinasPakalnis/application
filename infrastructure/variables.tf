variable "credentials_file" {
  type        = string
  description = "Path to the service account key file"
}

variable "project_id" {
  description = "Devops 555 project ID"
}

variable "region" {
  default = "europe-west1"
}

variable "database_password" {
  description = "The password for the Postgres user"
  type        = string
  sensitive   = true
}

variable "db_ip" {
  description = "Your local IP with /32"
  type        = string
}

variable "docker_image_url" {
  description = "GCR or Artifact Registry image"
  type        = string
}

variable "credentials_path" {
  description = "Path to the service account key file"
  type        = string
}
