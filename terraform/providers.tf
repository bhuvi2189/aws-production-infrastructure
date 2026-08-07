provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "aws-production-infrastructure"
      Environment = "dev"
      ManagedBy   = "Terraform"
      Owner       = "Bhuvanesh"
    }
  }
}
