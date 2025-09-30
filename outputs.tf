# Terraform outputs for Metanoia v1.0.1 AWS Infrastructure
# This file contains all the output definitions for easy reference

# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.metanoia_vpc.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.metanoia_vpc.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public_subnets[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private_subnets[*].id
}

output "database_subnet_ids" {
  description = "IDs of the database subnets"
  value       = aws_subnet.database_subnets[*].id
}

# RDS PostgreSQL Outputs
output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.metanoia_postgres.endpoint
}

output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.metanoia_postgres.port
}

output "database_url" {
  description = "Complete database URL for PostgreSQL connection"
  value       = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.metanoia_postgres.endpoint}:${aws_db_instance.metanoia_postgres.port}/${var.db_name}"
  sensitive   = true
}

output "rds_arn" {
  description = "RDS instance ARN"
  value       = aws_db_instance.metanoia_postgres.arn
}

output "rds_identifier" {
  description = "RDS instance identifier"
  value       = aws_db_instance.metanoia_postgres.identifier
}

# EKS Cluster Outputs
output "eks_cluster_id" {
  description = "EKS cluster ID"
  value       = aws_eks_cluster.metanoia_cluster.id
}

output "eks_cluster_arn" {
  description = "EKS cluster ARN"
  value       = aws_eks_cluster.metanoia_cluster.arn
}

output "eks_cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.metanoia_cluster.endpoint
}

output "eks_cluster_version" {
  description = "EKS cluster version"
  value       = aws_eks_cluster.metanoia_cluster.version
}

output "eks_cluster_security_group_id" {
  description = "EKS cluster security group ID"
  value       = aws_security_group.eks_cluster_sg.id
}

output "eks_node_group_arn" {
  description = "EKS node group ARN"
  value       = aws_eks_node_group.metanoia_node_group.arn
}

output "eks_oidc_issuer_url" {
  description = "EKS OIDC issuer URL"
  value       = aws_eks_cluster.metanoia_cluster.identity[0].oidc[0].issuer
}

output "eks_oidc_provider_arn" {
  description = "EKS OIDC provider ARN"
  value       = aws_iam_openid_connect_provider.eks_oidc.arn
}

# Network Outputs
output "nat_gateway_ip" {
  description = "NAT Gateway public IP"
  value       = aws_eip.nat_eip.public_ip
}

# Infrastructure Summary
output "infrastructure_summary" {
  description = "Summary of deployed infrastructure"
  value = {
    region           = var.aws_region
    environment      = var.environment
    project_name     = var.project_name
    vpc_id           = aws_vpc.metanoia_vpc.id
    rds_endpoint     = aws_db_instance.metanoia_postgres.endpoint
    eks_cluster_name = aws_eks_cluster.metanoia_cluster.name
    eks_endpoint     = aws_eks_cluster.metanoia_cluster.endpoint
    node_group_size  = var.node_group_desired_size
  }
}
