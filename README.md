# 🚀 AWS Production DevSecOps Platform

A production-style **DevSecOps and GitOps platform** built on AWS using Docker, Kubernetes (EKS), GitHub Actions, Amazon ECR, Trivy, Argo CD, Prometheus, and Grafana.

The project demonstrates an end-to-end workflow where application code is built, security-scanned, containerized, pushed to Amazon ECR, and automatically deployed to Amazon EKS through **Argo CD GitOps**.

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       Developer      │
                         │      Git Push        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       GitHub         │
                         │   Source Repository  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   GitHub Actions     │
                         │      CI Pipeline     │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
             ┌───────────────┐             ┌───────────────┐
             │ Docker Build  │             │ Trivy Scan    │
             └───────┬───────┘             └───────┬───────┘
                     │                             │
                     └──────────────┬──────────────┘
                                    ▼
                         ┌──────────────────────┐
                         │     Amazon ECR        │
                         │   Container Registry  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   GitOps Manifest    │
                         │  Kubernetes YAML     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Argo CD        │
                         │  GitOps Controller   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       AWS EKS        │
                         │ Kubernetes Cluster   │
                         └──────────┬───────────┘
                                    │
                       ┌────────────┴────────────┐
                       ▼                         ▼
              ┌─────────────────┐       ┌─────────────────┐
              │ Weather         │       │ Monitoring      │
              │ Analytics App   │       │ Stack           │
              └─────────────────┘       └───────┬─────────┘
                                                │
                                      ┌─────────┴─────────┐
                                      ▼                   ▼
                                 Prometheus           Grafana
```

---

## 🎯 Project Objectives

* Build a production-style AWS DevSecOps environment.
* Containerize a frontend application using Docker.
* Deploy the application on Amazon EKS.
* Store Docker images in Amazon ECR.
* Implement CI using GitHub Actions.
* Perform container vulnerability scanning using Trivy.
* Implement GitOps-based deployment using Argo CD.
* Monitor Kubernetes infrastructure using Prometheus and Grafana.
* Implement automated deployment and self-healing.

---

## 🛠️ Technology Stack

### Cloud

* AWS
* Amazon EKS
* Amazon ECR
* IAM
* VPC
* Elastic Load Balancer

### DevOps / DevSecOps

* Git
* GitHub
* GitHub Actions
* Docker
* Kubernetes
* Argo CD
* Trivy

### Monitoring

* Prometheus
* Grafana
* Alertmanager
* kube-state-metrics
* Node Exporter

### Application

* React
* TypeScript
* Vite
* Nginx

---

## 📁 Repository Structure

```text
aws-production-infrastructure/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── kubernetes/
│   ├── deployment.yaml
│   └── service.yaml
│
├── weather-analytics/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── argocd-application.yaml
├── github-actions-eks-policy.json
├── github-actions-trust-policy.json
└── README.md
```

---

# 🔄 CI/CD + GitOps Workflow

The project follows a CI/CD and GitOps-based deployment model.

### 1. Developer Push

Developer pushes changes to the `main` branch.

```bash
git add .
git commit -m "update application"
git push origin main
```

### 2. GitHub Actions

GitHub Actions automatically starts the CI pipeline.

The pipeline performs:

```text
Checkout
   ↓
Configure AWS Credentials
   ↓
Docker Build
   ↓
Trivy Security Scan
   ↓
Push Image to Amazon ECR
   ↓
Update Kubernetes Manifest
   ↓
Commit & Push Manifest
```

### 3. Security Scan

Trivy scans the Docker image for vulnerabilities.

The pipeline is configured to fail when HIGH or CRITICAL vulnerabilities are detected.

### 4. Amazon ECR

The validated Docker image is pushed to:

```text
Amazon Elastic Container Registry
```

Each CI build uses the Git commit SHA as the image tag.

Example:

```text
weather-analytics:<GITHUB_SHA>
```

### 5. GitOps

GitHub Actions updates:

```text
kubernetes/deployment.yaml
```

with the newly created ECR image.

Argo CD monitors the GitHub repository and detects the manifest change.

### 6. Argo CD

Argo CD automatically synchronizes the desired state from Git to Kubernetes.

```text
Git Repository
      ↓
   Argo CD
      ↓
     EKS
```

The application uses:

* Automated synchronization
* Self-healing
* Automatic pruning

### 7. Kubernetes

The application is deployed to Amazon EKS using:

* Deployment
* Service
* LoadBalancer

The application is exposed through an AWS Load Balancer.

---

# 🔐 Security

Security is integrated into the CI/CD pipeline.

### Trivy

Trivy scans the Docker image before it is pushed to ECR.

Example local scan:

```bash
trivy image \
530540751236.dkr.ecr.ap-south-1.amazonaws.com/weather-analytics:2.0
```

The production image was verified with:

```text
Vulnerabilities: 0
Secrets: No findings
```

### GitHub OIDC

GitHub Actions uses AWS IAM OIDC instead of storing long-lived AWS access keys in GitHub.

```text
GitHub Actions
      ↓
GitHub OIDC
      ↓
AWS IAM Role
      ↓
AWS Services
```

This improves credential security and reduces the need for static AWS credentials.

---

# ☸️ Kubernetes

Application Deployment:

```yaml
kind: Deployment
```

Application Service:

```yaml
kind: Service
```

The service uses:

```yaml
type: LoadBalancer
```

This creates an AWS Load Balancer for external access.

Check deployment:

```bash
kubectl get deployment weather-analytics
```

Check pods:

```bash
kubectl get pods
```

Check service:

```bash
kubectl get svc weather-analytics
```

---

# 🔄 Argo CD

Argo CD is configured to monitor:

```text
Repository:
bhuvi2189/aws-production-infrastructure

Branch:
main

Path:
kubernetes
```

Argo CD Application:

```text
weather-analytics
```

Expected status:

```text
SYNC STATUS:   Synced
HEALTH STATUS: Healthy
```

Argo CD provides:

* GitOps deployment
* Automated synchronization
* Self-healing
* Deployment history
* Desired-state management

---

# 📊 Monitoring

The Kubernetes monitoring stack uses:

* Prometheus
* Grafana
* Alertmanager
* Node Exporter
* kube-state-metrics

Prometheus collects Kubernetes and infrastructure metrics.

Grafana is used to visualize:

* Node CPU
* Node memory
* Pod status
* Kubernetes resources
* Cluster metrics
* Application metrics

Example Prometheus query:

```promql
up
```

Example Kubernetes query:

```promql
kube_pod_info
```

---

# 📈 Grafana

Grafana dashboards provide visibility into the EKS cluster.

Important metrics include:

* CPU utilization
* Memory utilization
* Pod count
* Node health
* Kubernetes workloads
* Prometheus targets

Prometheus verification:

```text
Prometheus Version: 3.13.2
Instance Down: 0
Discovered Targets: 355
```

---

# 🚀 Deployment

### Build Docker Image

```bash
docker build -t weather-analytics:latest ./weather-analytics
```

### Run Locally

```bash
docker run -d \
  --name weather-test \
  -p 8080:80 \
  weather-analytics:latest
```

Test:

```bash
curl http://localhost:8080
```

### Push to ECR

```bash
docker tag weather-analytics:latest \
530540751236.dkr.ecr.ap-south-1.amazonaws.com/weather-analytics:latest
```

```bash
docker push \
530540751236.dkr.ecr.ap-south-1.amazonaws.com/weather-analytics:latest
```

---

# ☸️ Kubernetes Deployment

Apply the Kubernetes manifests:

```bash
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
```

Check:

```bash
kubectl get pods
kubectl get svc weather-analytics
```

---

# 🔍 Health Verification

Check Argo CD:

```bash
kubectl get application -n argocd
```

Expected:

```text
weather-analytics   Synced   Healthy
```

Check application:

```bash
kubectl get pods
```

Expected:

```text
weather-analytics-xxxxx   1/1   Running
```

Check image:

```bash
kubectl get deployment weather-analytics \
-o jsonpath='{.spec.template.spec.containers[0].image}'
```

---

# 🧪 DevSecOps Pipeline Result

The completed pipeline provides:

```text
✅ Source Control
✅ Automated CI
✅ Docker Build
✅ Vulnerability Scanning
✅ Container Registry
✅ GitOps Deployment
✅ Kubernetes Deployment
✅ Automated Synchronization
✅ Self-Healing
✅ Monitoring
```

---

# 💡 Key DevOps Concepts Demonstrated

This project demonstrates practical knowledge of:

* AWS EKS
* Kubernetes
* Docker
* Container Registry
* CI/CD
* GitHub Actions
* GitOps
* Argo CD
* IAM
* AWS OIDC
* Infrastructure Security
* Container Security
* Trivy
* Prometheus
* Grafana
* Kubernetes Monitoring
* Load Balancing
* Linux
* Git

---

# 🏆 Project Outcome

The final platform provides an automated DevSecOps workflow:

```text
Developer
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Docker Build
   ↓
Trivy Security Scan
   ↓
Amazon ECR
   ↓
GitOps Manifest Update
   ↓
Argo CD
   ↓
Amazon EKS
   ↓
Weather Analytics Application
   ↓
Prometheus + Grafana
```

This architecture provides automated application delivery, container security, GitOps-based Kubernetes deployment, and infrastructure monitoring.

---

## 👨‍💻 Author

**Bhuvanesh**

GitHub: https://github.com/bhuvi2189

---

## ⭐ Future Improvements

Possible future enhancements:

* Terraform-based complete EKS provisioning
* Helm-based application deployment
* AWS Secrets Manager integration
* HTTPS with ACM
* Route 53 domain
* Prometheus Alertmanager notifications
* ELK/OpenSearch centralized logging
* Horizontal Pod Autoscaler
* Kubernetes Network Policies
* Multi-environment deployment
* Blue/Green or Canary deployments
# CI/CD verified
# CI/CD debug
# EKS deployment permission fix
