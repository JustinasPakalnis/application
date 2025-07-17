variable "docker_image_url" {
  description = "GCR or Artifact Registry image"
  type        = string
}
variable "region" {
  default = "europe-west1"
}
variable "project_id" {
  description = "Devops 555 project ID"
  type        = string
  default     = "justinas"
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

variable "credentials" {
  description = "GCP credentials"
  type        = string
}

variable "pr_number" {
  description = "PR number"
  type        = string
}
