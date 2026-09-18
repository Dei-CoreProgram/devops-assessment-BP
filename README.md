# DevOps Assessment - Banco Pichincha

Microservicio RESTful con endpoint `/DevOps` que procesa mensajes con autenticación vía API Key y JWT, implementado en Node.js.

## Requisitos

- Node.js 18+
- Docker
- Docker Compose
- Kubernetes (opcional, para despliegue en cluster)
- kubectl (opcional)
- Terraform (opcional, para infraestructura en AWS)
- AWS CLI (opcional, para despliegue en AWS)

## Arquitectura

- **Lenguaje:** Node.js (Express)
- **Container:** Docker
- **Load Balancer:** Nginx (docker-compose) / Kubernetes Service
- **CI/CD:** GitHub Actions
- **Orquestación:** Kubernetes con HPA (Horizontal Pod Autoscaler)
- **IaC:** Terraform (AWS EKS)

## Estructura del Proyecto

```
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Pipeline CI/CD
├── src/
│   ├── index.js               # Microservicio
│   └── index.test.js          # Tests unitarios
├── terraform/
│   ├── main.tf                # Recursos AWS
│   ├── variables.tf           # Variables Terraform
│   └── outputs.tf             # Outputs Terraform
├── Dockerfile                 # Imagen Docker
├── docker-compose.yml         # Compose con load balancer
├── nginx.conf                 # Configuración Nginx
├── k8s-deployment.yaml        # Kubernetes manifests
├── package.json               # Dependencias Node.js
├── jest.config.js             # Configuración Jest
├── .eslintrc.json             # Configuración ESLint
├── .gitignore                 # Archivos ignorados
└── README.md                  # Este archivo
```

## Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/devops-assessment.git
cd devops-assessment
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar con Docker Compose (recomendado)

```bash
docker-compose up -d
```

Esto iniciará:
- 2 instancias del microservicio (puertos 8081 y 8082)
- Nginx como load balancer (puerto 80)

### 4. Ejecutar localmente (sin Docker)

```bash
npm start
```

El servicio estará disponible en `http://localhost:8080`

## Uso del Endpoint

### Request

```bash
curl -X POST \
  -H "X-Parse-REST-API-Key: 2f5ae96c-b558-4c7b-a590-a501ae1c3f6c" \
  -H "X-JWT-KWY: YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "This is a test",
    "to": "Juan Perez",
    "from": "Rita Asturia",
    "timeToLifeSec": 45
  }' \
  http://localhost/DevOps
```

### Response

```json
{
  "message": "Hello Juan Perez your message will be send"
}
```

## Generación de JWT

Para generar un JWT válido, puedes usar herramientas como [jwt.io](https://jwt.io) o generar uno programáticamente con Node.js:

```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign({ sub: 'test' }, 'your-secret-key-change-in-production');
console.log(token);
```

El microservicio usa el secreto: `your-secret-key-change-in-production` (debe cambiarse en producción).

## Tests

```bash
npm test
```

Para ejecutar tests en modo watch:

```bash
npm run test:watch
```

## Linting

```bash
npm run lint
```

Para corregir automáticamente:

```bash
npm run lint:fix
```

## CI/CD Pipeline

El pipeline se ejecuta automáticamente en GitHub Actions con los siguientes stages:

### Stage: Build
- Checkout código
- Setup Node.js
- Install dependencies
- Run linter (ESLint)
- Run tests con coverage (Jest)
- Build Docker image
- Vulnerability scan (Trivy)

### Stage: Deploy (solo en rama main)
- Configure AWS credentials
- Setup Terraform
- Terraform Init
- Terraform Apply (crea infraestructura en AWS)
- Configure kubectl
- Deploy a Kubernetes

## Terraform - Infraestructura como Código

El proyecto incluye configuración Terraform para desplegar en AWS:

### Recursos creados:
- VPC con 2 subnets públicas
- Internet Gateway
- EKS Cluster (Kubernetes administrado por AWS)
- EKS Node Group con 2-4 nodos
- IAM Roles y Policies

### Desplegar infraestructura:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### Destruir infraestructura:

```bash
terraform destroy
```

## Despliegue en Kubernetes

### Local (Minikube/Kind):

```bash
kubectl apply -f k8s-deployment.yaml
```

### AWS EKS (después de Terraform):

```bash
aws eks update-kubeconfig --name devops-assessment-cluster --region us-east-1
kubectl apply -f k8s-deployment.yaml
```

Esto creará:
- Deployment con 2 réplicas
- Service tipo LoadBalancer
- Secret para JWT
- HPA para auto-escalado (2-10 pods)

## Características Implementadas

- ✅ Endpoint `/DevOps` con método POST
- ✅ Autenticación con API Key (`X-Parse-REST-API-Key`)
- ✅ Validación de JWT (`X-JWT-KWY`)
- ✅ Error handling para métodos HTTP no permitidos
- ✅ Containerización con Docker
- ✅ Load balancer con Nginx (2+ nodos)
- ✅ Infraestructura como código (Terraform + Kubernetes)
- ✅ CI/CD pipeline con GitHub Actions
- ✅ Tests unitarios (Jest + Supertest)
- ✅ Static code analysis (ESLint)
- ✅ Dynamic scaling (HPA en Kubernetes)
- ✅ Dependency management (npm)
- ✅ Health check endpoint

## Variables de Entorno

| Variable | Valor por defecto | Descripción |
|----------|------------------|-------------|
| PORT | 8080 | Puerto del servicio |
| JWT_SECRET | your-secret-key-change-in-production | Secreto para JWT |

## Seguridad

- Cambiar `JWT_SECRET` en producción
- Usar secrets de Kubernetes para credenciales
- Habilitar HTTPS en producción
- Implementar rate limiting
- Usar variables de entorno para datos sensibles

## Costos Estimados (AWS)

- EKS Cluster: ~$72/mes (control plane)
- EKS Nodes (t3.medium x2): ~$60/mes
- Load Balancer: ~$18/mes
- **Total estimado:** ~$150/mes

## Autor

David KunturX

## Licencia

MIT
