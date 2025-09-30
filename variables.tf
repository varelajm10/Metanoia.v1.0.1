# Terraform variables for Metanoia v1.0.1 AWS Infrastructure
# This file contains all variable definitions

# General Configuration
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "metanoia"
}

variable "owner" {
  description = "Owner of the resources"
  type        = string
  default     = "Metanoia Team"
}

# Network Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
  
  validation {
    condition     = can(cidrhost(var.vpc_cidr, 0))
    error_message = "VPC CIDR must be a valid CIDR block."
  }
}

# Database Configuration
variable "postgres_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "15.4"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.small"
  
  validation {
    condition     = can(regex("^db\\.[a-z0-9]+\\.[a-z0-9]+$", var.db_instance_class))
    error_message = "DB instance class must be a valid RDS instance type (e.g., db.t3.small)."
  }
}

variable "db_allocated_storage" {
  description = "Initial allocated storage for RDS instance (GB)"
  type        = number
  default     = 20
  
  validation {
    condition     = var.db_allocated_storage >= 20 && var.db_allocated_storage <= 65536
    error_message = "Allocated storage must be between 20 and 65536 GB."
  }
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for RDS instance (GB)"
  type        = number
  default     = 100
  
  validation {
    condition     = var.db_max_allocated_storage >= var.db_allocated_storage
    error_message = "Max allocated storage must be greater than or equal to allocated storage."
  }
}

variable "db_name" {
  description = "Name of the initial database"
  type        = string
  default     = "metanoia"
  
  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9_]*$", var.db_name))
    error_message = "Database name must start with a letter and contain only letters, numbers, and underscores."
  }
}

variable "db_username" {
  description = "Master username for RDS instance"
  type        = string
  default     = "metanoia_admin"
  
  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9_]*$", var.db_username))
    error_message = "Database username must start with a letter and contain only letters, numbers, and underscores."
  }
}

variable "db_password" {
  description = "Master password for RDS instance"
  type        = string
  sensitive   = true
  
  validation {
    condition     = length(var.db_password) >= 8
    error_message = "Database password must be at least 8 characters long."
  }
}

variable "backup_retention_period" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
  
  validation {
    condition     = var.backup_retention_period >= 0 && var.backup_retention_period <= 35
    error_message = "Backup retention period must be between 0 and 35 days."
  }
}

variable "backup_window" {
  description = "Backup window (UTC)"
  type        = string
  default     = "03:00-04:00"
  
  validation {
    condition     = can(regex("^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$", var.backup_window))
    error_message = "Backup window must be in format HH:MM-HH:MM (UTC)."
  }
}

variable "maintenance_window" {
  description = "Maintenance window (UTC)"
  type        = string
  default     = "sun:04:00-sun:05:00"
  
  validation {
    condition     = can(regex("^(sun|mon|tue|wed|thu|fri|sat):[0-9]{2}:[0-9]{2}-(sun|mon|tue|wed|thu|fri|sat):[0-9]{2}:[0-9]{2}$", var.maintenance_window))
    error_message = "Maintenance window must be in format ddd:hh:mm-ddd:hh:mm (UTC)."
  }
}

variable "multi_az" {
  description = "Enable Multi-AZ deployment"
  type        = bool
  default     = true
}

variable "monitoring_interval" {
  description = "Enhanced monitoring interval (0, 1, 5, 10, 15, 30, 60)"
  type        = number
  default     = 60
  
  validation {
    condition     = contains([0, 1, 5, 10, 15, 30, 60], var.monitoring_interval)
    error_message = "Monitoring interval must be one of: 0, 1, 5, 10, 15, 30, 60."
  }
}

variable "performance_insights_enabled" {
  description = "Enable Performance Insights"
  type        = bool
  default     = true
}

variable "deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
  default     = true
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot when deleting"
  type        = bool
  default     = false
}

# EKS Configuration
variable "kubernetes_version" {
  description = "Kubernetes version for EKS cluster"
  type        = string
  default     = "1.28"
}

variable "node_group_desired_size" {
  description = "Desired number of nodes in the node group"
  type        = number
  default     = 2
  
  validation {
    condition     = var.node_group_desired_size >= 1
    error_message = "Desired size must be at least 1."
  }
}

variable "node_group_max_size" {
  description = "Maximum number of nodes in the node group"
  type        = number
  default     = 4
  
  validation {
    condition     = var.node_group_max_size >= var.node_group_desired_size
    error_message = "Max size must be greater than or equal to desired size."
  }
}

variable "node_group_min_size" {
  description = "Minimum number of nodes in the node group"
  type        = number
  default     = 1
  
  validation {
    condition     = var.node_group_min_size <= var.node_group_desired_size
    error_message = "Min size must be less than or equal to desired size."
  }
}

variable "node_group_instance_type" {
  description = "Instance type for EKS node group"
  type        = string
  default     = "t3.medium"
}

variable "node_group_capacity_type" {
  description = "Capacity type for EKS node group (ON_DEMAND or SPOT)"
  type        = string
  default     = "ON_DEMAND"
  
  validation {
    condition     = contains(["ON_DEMAND", "SPOT"], var.node_group_capacity_type)
    error_message = "Capacity type must be either ON_DEMAND or SPOT."
  }
}

variable "ec2_key_pair_name" {
  description = "EC2 Key Pair name for SSH access to nodes"
  type        = string
  default     = ""
}
