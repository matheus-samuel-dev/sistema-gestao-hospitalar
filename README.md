# HealthCare - Sistema de Gestao Hospitalar

Aplicacao web full stack para gestao hospitalar, criada como projeto principal de portfolio Java Back-end / Full Stack. O HealthCare simula um produto SaaS real para clinicas, hospitais e centros medicos, com dashboard analitico, agenda medica, prontuario eletronico, CRUDs, financeiro, farmacia, relatorios, autenticacao JWT e Docker.

> Banner sugerido: screenshot do dashboard com sidebar navy, cards brancos e graficos de consultas/receita.

## Funcionalidades

- Autenticacao com JWT e refresh token.
- Controle de acesso por perfis: `ADMIN`, `MEDICO`, `RECEPCAO`, `FINANCEIRO`.
- Dashboard executivo com indicadores, graficos e listas operacionais.
- CRUD de pacientes com busca, status, paginacao visual e dados clinicos.
- CRUD de medicos com CRM, especialidade e disponibilidade.
- Agenda visual por medico, horarios e status da consulta.
- Prontuario eletronico com abas, resumo, historico, exames, prescricoes e documentos.
- Modulos de exames, internacoes, financeiro, farmacia e relatorios.
- Auditoria para acoes relevantes no backend.
- Seed automatico com usuarios, medicos, pacientes e dados hospitalares ficticios.
- Swagger/OpenAPI.
- Docker Compose com Postgres, API e frontend.
- Testes unitarios com JUnit 5 e Mockito.

## Tecnologias

### Backend

Java 21, Spring Boot 3, Spring Security, JWT, Refresh Token, Spring Data JPA, Hibernate, PostgreSQL, Flyway, Bean Validation, Swagger/OpenAPI, JUnit 5, Mockito e Maven.

### Frontend

React, Vite, TypeScript, React Router, Axios, Tailwind CSS, Recharts, React Hook Form, Zod, React Hot Toast e layout responsivo.

### Infra

Docker, Docker Compose, PostgreSQL em container, backend em container e frontend em container com Nginx.

## Arquitetura

```text
sistema-gestao-hospitalar/
├── backend/
│   ├── src/main/java/com/portfolio/healthcare/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── mapper/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   └── src/test/java/com/portfolio/healthcare/service/
├── frontend/
│   ├── src/components/
│   ├── src/data/
│   ├── src/hooks/
│   ├── src/pages/
│   ├── src/services/
│   └── src/types/
├── docker-compose.yml
└── .env.example
```

## Como Rodar Com Docker

```bash
cp .env.example .env
docker compose up --build
```

Servicos:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- PostgreSQL: localhost:5432

## Como Rodar Localmente

### Backend

Crie um PostgreSQL local com banco `healthcare` ou suba apenas o banco:

```bash
docker compose up postgres
```

Depois rode:

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend local: http://localhost:5173

## Usuarios de Teste

| Perfil | E-mail | Senha |
| --- | --- | --- |
| ADMIN | admin@healthcare.com | 123456 |
| MEDICO | medico@healthcare.com | 123456 |
| RECEPCAO | recepcao@healthcare.com | 123456 |
| FINANCEIRO | financeiro@healthcare.com | 123456 |

## Endpoints Principais

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/dashboard`
- `GET /api/patients`
- `POST /api/patients`
- `GET /api/doctors`
- `POST /api/doctors`
- `GET /api/appointments`
- `POST /api/appointments`
- `PATCH /api/appointments/{id}/cancel`
- `GET /api/medical-records/patient/{patientId}`
- `POST /api/exams`
- `POST /api/hospitalizations`
- `GET /api/finance/summary`
- `GET /api/pharmacy/medicines`
- `GET /api/reports`

## Testes

```bash
cd backend
mvn test
```

Cobertura implementada para:

- `PatientService`
- `DoctorService`
- `AppointmentService`
- `MedicalRecordService`
- `PaymentService`
- `MedicineService`
- `AuthService`

## Capturas de Tela Sugeridas Para Portfolio

- Login com hero institucional.
- Dashboard com cards e graficos.
- Agenda por medico.
- Prontuario eletronico com abas.
- Financeiro com receita e pagamentos.
- Relatorios executivos.

## Proximos Passos

- Adicionar testes de integracao com Testcontainers.
- Implementar exportacao PDF real com JasperReports ou OpenPDF.
- Implementar exportacao Excel real com Apache POI.
- Adicionar upload de documentos do prontuario.
- Criar notificacoes em tempo real com WebSocket.
- Adicionar CI com GitHub Actions.

## Autor

Projeto criado para portfolio de Desenvolvedor Java Back-end / Full Stack.
