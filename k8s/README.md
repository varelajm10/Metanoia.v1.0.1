# Manifiestos de Kubernetes para Metanoia ERP

Este directorio contiene los manifiestos de Kubernetes necesarios para desplegar Metanoia ERP v1.0.1 en un clúster de Amazon EKS.

## Archivos incluidos

- `namespace.yaml` - Namespace para la aplicación
- `configmap.yaml` - Configuración no sensible
- `secret.yaml` - Secretos y variables de entorno sensibles
- `deployment.yaml` - Despliegue de la aplicación
- `service.yaml` - Servicio LoadBalancer
- `ingress.yaml` - Ingress para routing HTTP/HTTPS

## Configuración requerida

### Variables de entorno necesarias en GitHub Secrets:

- `AWS_ACCESS_KEY_ID` - ID de acceso de AWS
- `AWS_SECRET_ACCESS_KEY` - Clave secreta de AWS
- `DATABASE_URL` - URL de conexión a PostgreSQL
- `REDIS_URL` - URL de conexión a Redis
- `JWT_SECRET` - Clave secreta para JWT
- `NEXTAUTH_SECRET` - Clave secreta para NextAuth
- `NEXTAUTH_URL` - URL base de la aplicación

### Recursos de AWS necesarios:

1. **Amazon ECR Repository**: `metanoia-erp`
2. **Amazon EKS Cluster**: `metanoia-cluster`
3. **Base de datos PostgreSQL** (RDS o externa)
4. **Redis** (ElastiCache o externo)

## Despliegue manual

Para desplegar manualmente:

```bash
# Aplicar todos los manifiestos
kubectl apply -f k8s/

# Verificar el despliegue
kubectl get pods -n metanoia
kubectl get services -n metanoia
kubectl get ingress -n metanoia
```

## Monitoreo

```bash
# Ver logs de la aplicación
kubectl logs -l app=metanoia-app -n metanoia -f

# Verificar estado de los pods
kubectl get pods -n metanoia -o wide

# Verificar servicios
kubectl get svc -n metanoia
```

## Escalado

```bash
# Escalar horizontalmente
kubectl scale deployment metanoia-app -n metanoia --replicas=5

# Verificar el escalado
kubectl get pods -n metanoia
```
