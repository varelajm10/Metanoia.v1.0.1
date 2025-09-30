# Infraestructura AWS para Metanoia v1.0.1

Este directorio contiene la configuración de Terraform para desplegar la infraestructura AWS necesaria para el sistema ERP SaaS Metanoia v1.0.1.

## Arquitectura Desplegada

### Componentes Principales

1. **VPC y Redes**
   - VPC con CIDR 10.0.0.0/16
   - 2 Subnets públicas para NAT Gateway y Load Balancers
   - 2 Subnets privadas para EKS cluster
   - 2 Subnets de base de datos para RDS
   - Internet Gateway y NAT Gateway

2. **Base de Datos PostgreSQL (RDS)**
   - PostgreSQL 15.4 en db.t3.small
   - Multi-AZ habilitado para alta disponibilidad
   - Almacenamiento encriptado con GP3
   - Backup automático con retención de 7 días
   - Performance Insights habilitado
   - Enhanced Monitoring

3. **Clúster EKS**
   - Kubernetes 1.28
   - Node Group con instancias t3.medium
   - Auto Scaling configurado (1-4 nodos)
   - OIDC Identity Provider configurado
   - Logs de cluster habilitados

## Prerrequisitos

1. **AWS CLI configurado** con credenciales apropiadas
2. **Terraform** versión >= 1.0 instalado
3. **kubectl** para interactuar con el clúster EKS
4. **aws-iam-authenticator** para autenticación EKS

## Configuración Inicial

### 1. Clonar y configurar variables

```bash
# Copiar el archivo de ejemplo de variables
cp terraform.tfvars.example terraform.tfvars

# Editar las variables según tu entorno
nano terraform.tfvars
```

### 2. Configurar credenciales AWS

```bash
# Configurar AWS CLI
aws configure

# O usar variables de entorno
export AWS_ACCESS_KEY_ID="tu-access-key"
export AWS_SECRET_ACCESS_KEY="tu-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
```

## Despliegue

### 1. Inicializar Terraform

```bash
terraform init
```

### 2. Planificar el despliegue

```bash
terraform plan
```

### 3. Aplicar la configuración

```bash
terraform apply
```

### 4. Obtener outputs importantes

```bash
# Obtener el endpoint de la base de datos
terraform output rds_endpoint

# Obtener el endpoint del clúster EKS
terraform output eks_cluster_endpoint

# Obtener la URL completa de la base de datos
terraform output database_url
```

## Configuración Post-Despliegue

### 1. Configurar kubectl para EKS

```bash
# Actualizar kubeconfig
aws eks update-kubeconfig --region us-east-1 --name metanoia-cluster

# Verificar conexión
kubectl get nodes
```

### 2. Conectar aplicación a la base de datos

Usar los outputs de Terraform para configurar las variables de entorno de tu aplicación:

```bash
# Ejemplo de variables de entorno para la aplicación
export DATABASE_URL=$(terraform output -raw database_url)
export EKS_CLUSTER_ENDPOINT=$(terraform output -raw eks_cluster_endpoint)
```

## Variables de Configuración

### Variables Principales

| Variable                   | Descripción                | Valor por Defecto |
| -------------------------- | -------------------------- | ----------------- |
| `aws_region`               | Región de AWS              | `us-east-1`       |
| `environment`              | Entorno (dev/staging/prod) | `dev`             |
| `project_name`             | Nombre del proyecto        | `metanoia`        |
| `db_instance_class`        | Tipo de instancia RDS      | `db.t3.small`     |
| `node_group_instance_type` | Tipo de instancia EKS      | `t3.medium`       |

### Variables de Base de Datos

| Variable                   | Descripción                 | Valor por Defecto |
| -------------------------- | --------------------------- | ----------------- |
| `postgres_version`         | Versión de PostgreSQL       | `15.4`            |
| `db_allocated_storage`     | Almacenamiento inicial (GB) | `20`              |
| `db_max_allocated_storage` | Almacenamiento máximo (GB)  | `100`             |
| `multi_az`                 | Multi-AZ habilitado         | `true`            |
| `backup_retention_period`  | Días de retención de backup | `7`               |

### Variables de EKS

| Variable                  | Descripción           | Valor por Defecto |
| ------------------------- | --------------------- | ----------------- |
| `kubernetes_version`      | Versión de Kubernetes | `1.28`            |
| `node_group_desired_size` | Nodos deseados        | `2`               |
| `node_group_max_size`     | Máximo de nodos       | `4`               |
| `node_group_min_size`     | Mínimo de nodos       | `1`               |

## Outputs Importantes

### Base de Datos

- `rds_endpoint`: Endpoint de la base de datos
- `database_url`: URL completa de conexión (sensible)
- `rds_port`: Puerto de la base de datos

### EKS Cluster

- `eks_cluster_endpoint`: Endpoint del clúster
- `eks_cluster_arn`: ARN del clúster
- `eks_oidc_issuer_url`: URL del proveedor OIDC

### Red

- `vpc_id`: ID de la VPC
- `private_subnet_ids`: IDs de las subnets privadas
- `public_subnet_ids`: IDs de las subnets públicas

## Seguridad

### Configuraciones de Seguridad Implementadas

1. **Base de Datos**
   - Encriptación en tránsito y en reposo
   - Subnets privadas para la base de datos
   - Security Groups restrictivos
   - Deletion protection habilitado

2. **EKS Cluster**
   - Endpoint privado habilitado
   - Security Groups configurados
   - OIDC Identity Provider para RBAC
   - Logs de auditoría habilitados

3. **Red**
   - VPC aislada
   - NAT Gateway para tráfico saliente
   - Subnets privadas para cargas de trabajo

## Costos Estimados

### Costos Mensuales Aproximados (us-east-1)

- **RDS PostgreSQL (db.t3.small, Multi-AZ)**: ~$60-80/mes
- **EKS Cluster**: ~$72/mes
- **NAT Gateway**: ~$45/mes
- **EC2 Instances (2x t3.medium)**: ~$60/mes
- **Total Estimado**: ~$240-260/mes

_Nota: Los costos pueden variar según el uso y la región._

## Mantenimiento

### Actualizaciones

```bash
# Actualizar Terraform y providers
terraform init -upgrade

# Planificar cambios
terraform plan

# Aplicar actualizaciones
terraform apply
```

### Backups

- Los backups de RDS se manejan automáticamente
- Para el estado de Terraform, considera usar un backend remoto (S3 + DynamoDB)

### Monitoreo

- CloudWatch logs habilitados para EKS
- Performance Insights para RDS
- Enhanced Monitoring para RDS

## Destrucción de Recursos

⚠️ **ADVERTENCIA**: Esto eliminará todos los recursos desplegados.

```bash
# Planificar destrucción
terraform plan -destroy

# Aplicar destrucción
terraform destroy
```

## Troubleshooting

### Problemas Comunes

1. **Error de permisos AWS**

   ```bash
   # Verificar credenciales
   aws sts get-caller-identity
   ```

2. **Error de límites de AWS**
   - Verificar límites de servicio en AWS Console
   - Solicitar aumento de límites si es necesario

3. **Error de conectividad EKS**
   ```bash
   # Reconfigurar kubectl
   aws eks update-kubeconfig --region us-east-1 --name metanoia-cluster
   ```

## Soporte

Para soporte técnico o preguntas sobre la infraestructura, contacta al equipo de Metanoia.

---

**Metanoia v1.0.1** - Sistema ERP SaaS Multi-tenant
