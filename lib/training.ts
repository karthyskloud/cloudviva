export const trainingTracks = [
  {
    id: "cloud-foundations",
    number: "01",
    title: "Cloud foundations",
    audience: "New to cloud or moving from on-premises systems",
    prerequisites: "No cloud-provider experience required. Basic computer and web-app concepts are helpful, but examples start from first principles.",
    summary: "Learn how cloud environments are organized, secured, operated, and paid for before choosing a specific provider.",
    modules: [
      {
        title: "Cloud model and shared responsibility",
        topics: ["IaaS, PaaS, and SaaS trade-offs", "Regions, zones, and availability", "What the provider secures versus what your team owns"],
        lab: "Draw a simple application architecture and mark who operates each layer.",
      },
      {
        title: "Identity and network boundaries",
        topics: ["Users, roles, service identities, and least privilege", "IP addresses, subnets, routes, and DNS", "Public and private access boundaries"],
        lab: "Design a public web tier and private data tier, then trace one request through the network.",
      },
      {
        title: "Choose compute, storage, and data services",
        topics: ["Virtual machines, containers, and serverless", "Object, block, and file storage", "Managed databases and service trade-offs"],
        lab: "Select services for a small API and explain the operational trade-offs.",
      },
      {
        title: "Operate a cloud workload",
        topics: ["Logs, metrics, alerts, and health checks", "Backups, restore tests, and recovery objectives", "Budgets, tags, and cost visibility"],
        lab: "Build a first-week operations checklist with an alert, a restore check, and a budget guardrail.",
      },
      {
        title: "Design review and provider mapping",
        topics: ["Review security, reliability, and cost together", "Map concepts to one chosen cloud provider", "Document assumptions and open questions"],
        lab: "Present a provider-mapped design for a small production web service.",
      },
    ],
    capstone: "Produce a cloud architecture diagram, access boundary, operations checklist, and cost assumptions for a small web service.",
  },
  {
    id: "devops-foundations",
    number: "02",
    title: "DevOps and CI/CD from scratch",
    audience: "Developers and small teams currently deploying by hand",
    prerequisites: "No CI/CD pipeline or prior DevOps practice required. Basic command-line use and a small application repository are recommended.",
    summary: "Start with source control, automate repeatable checks, and build a safe route from a code change to a production release.",
    modules: [
      {
        title: "Source control and team workflow",
        topics: ["Commits, branches, and pull requests", "Small changes, reviews, and protected main branches", "Separate application code from deployment configuration"],
        lab: "Create a repository workflow with a feature branch, pull request, review checklist, and merge rule.",
      },
      {
        title: "Pipeline anatomy",
        topics: ["Events, workflows, jobs, steps, actions, and runners", "YAML structure and workflow triggers", "Reading logs and diagnosing a failed job"],
        lab: "Create a pull-request workflow that runs on every proposed change and inspect a deliberate failure.",
      },
      {
        title: "Continuous integration",
        topics: ["Install dependencies reproducibly", "Run lint, tests, and a build", "Save and identify a versioned build artifact"],
        lab: "Make a failing test block a merge, then publish an artifact from a passing build.",
      },
      {
        title: "Deliver safely to staging",
        topics: ["Environment-specific configuration", "Secret storage and short-lived cloud identity", "Approvals and controlled deployment permissions"],
        lab: "Deploy a sample application to a non-production environment without putting credentials in the repository.",
      },
      {
        title: "Release, observe, and recover",
        topics: ["Smoke checks and release verification", "Logs, alerts, and ownership after deployment", "Rollback triggers and incident notes"],
        lab: "Simulate a bad release, detect it with a check, and document the rollback path.",
      },
    ],
    capstone: "Deliver a sample application through pull-request checks to a staging environment, with an artifact, deployment approval, smoke check, and rollback note.",
  },
  {
    id: "infrastructure-as-code",
    number: "03",
    title: "Terraform: build and safely change cloud infrastructure",
    audience: "Developers or operators who want repeatable infrastructure changes",
    prerequisites: "Basic command-line and cloud-resource familiarity recommended. No Terraform experience required.",
    summary: "Move from a first Terraform configuration to reusable modules, state management, testing, and careful change review.",
    modules: [
      {
        title: "Start with a working configuration",
        topics: ["Providers, resources, and the dependency graph", "Initialize, format, and validate a configuration", "Read provider documentation and resource arguments"],
        lab: "Create one small resource, format the configuration, initialize the provider, and validate it.",
      },
      {
        title: "Make configuration reusable",
        topics: ["Variables, outputs, locals, and data sources", "References and implicit dependencies", "Separate configuration from secret values"],
        lab: "Parameterize the first configuration and output a value needed by a second component.",
      },
      {
        title: "Plan, apply, and understand change",
        topics: ["Read a plan before applying", "Create, update, replace, and destroy actions", "Use targeted review and avoid unsafe shortcuts"],
        lab: "Change a resource and explain the plan, including any replacement or data-loss risk, before applying.",
      },
      {
        title: "State, collaboration, and drift",
        topics: ["What state records and why it matters", "Remote backends, locking, and team collaboration", "Detect configuration drift and recover carefully"],
        lab: "Move a practice project to shared state and identify a simulated out-of-band change.",
      },
      {
        title: "Modules, tests, and environment design",
        topics: ["Extract and version a reusable module", "Test configuration assumptions", "Review security and policy checks in a change workflow"],
        lab: "Build a module interface and add automated checks for its expected inputs and outputs.",
      },
    ],
    capstone: "Build a small provider-specific environment from reusable Terraform modules, store state appropriately, run checks, and submit a reviewed plan through a pull request.",
  },
  {
    id: "containers-kubernetes",
    number: "04",
    title: "Containers to Kubernetes: deploy, scale, and update an app",
    audience: "Developers who want to understand how containerized apps run in a cluster",
    prerequisites: "Basic command-line use recommended. The first module introduces container images before moving into Kubernetes concepts.",
    summary: "Follow an application from container image to a running cluster workload, then practice how to expose, scale, update, and debug it.",
    modules: [
      {
        title: "Package an application as a container",
        topics: ["Images, containers, registries, and tags", "Ports, environment configuration, and filesystem basics", "Build a small image reproducibly"],
        lab: "Build and run a sample web app locally, then inspect its logs and exposed port.",
      },
      {
        title: "Understand the cluster model",
        topics: ["Control plane and worker nodes", "Pods, Deployments, and desired state", "Namespaces and basic resource requests"],
        lab: "Create a local practice cluster and inspect its nodes and system components.",
      },
      {
        title: "Deploy and discover an application",
        topics: ["Apply a Deployment manifest", "Labels, selectors, and Services", "Inspect events, pods, and application logs"],
        lab: "Deploy a containerized app and reach it through a Service inside the cluster.",
      },
      {
        title: "Expose and scale deliberately",
        topics: ["Ingress or load-balancer concepts", "Replica counts and horizontal scaling", "Readiness probes and resource limits"],
        lab: "Expose the app in a local environment, increase replicas, and observe the rollout.",
      },
      {
        title: "Update and debug a workload",
        topics: ["Image updates and rollout history", "Roll back an unsuccessful release", "Diagnose configuration, scheduling, and health failures"],
        lab: "Ship a new app version, trigger a failing deployment, and recover using rollout history.",
      },
    ],
    capstone: "Deploy a sample app to a local cluster, expose it, scale it, update its image, and document a debugging and rollback path.",
  },
];

export const upcomingCohorts = [
  {
    id: "cloud-foundations",
    title: "Cloud foundations for builders",
    focus: "A provider-neutral foundation in cloud architecture, identity, networking, operations, and cost.",
  },
  {
    id: "devops-foundations",
    title: "Your first CI/CD pipeline",
    focus: "Start with Git and pull requests, then build CI checks and a safe staging release from zero.",
  },
  {
    id: "infrastructure-as-code",
    title: "Terraform: build and safely change cloud infrastructure",
    focus: "Progress from your first resource to plans, state, modules, tests, and reviewed changes.",
  },
  {
    id: "containers-kubernetes",
    title: "Containers and Kubernetes for app teams",
    focus: "Build a container, deploy it to a local cluster, then scale, update, and debug it.",
  },
];

export const trainingReferences = [
  {
    label: "Google Cloud training resources",
    href: "https://cloud.google.com/learn/training",
    note: "Learning paths, courses, hands-on labs, and skill badges.",
  },
  {
    label: "HashiCorp Terraform tutorials",
    href: "https://developer.hashicorp.com/terraform/tutorials",
    note: "Start with providers and resources, then explore state, tests, and drift.",
  },
  {
    label: "GitHub Actions concepts",
    href: "https://docs.github.com/en/actions/get-started/understand-github-actions",
    note: "Workflows, events, jobs, steps, actions, runners, CI, and deployment.",
  },
  {
    label: "Kubernetes Basics",
    href: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
    note: "Create a cluster, deploy, expose, scale, update, and debug an application.",
  },
];