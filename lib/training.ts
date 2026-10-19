export const trainingTracks = [
  {
    id: "cloud-foundations",
    number: "01",
    title: "Cloud foundations",
    level: "Start here",
    summary: "Understand the building blocks behind a cloud environment before wiring an application into it.",
    topics: ["Regions, availability, and shared responsibility", "Identity, networking, compute, and storage", "Logging, budgets, and operational readiness"],
    outcome: "Sketch a small, secure cloud environment and explain the choices behind it.",
  },
  {
    id: "devops-foundations",
    number: "02",
    title: "DevOps and CI/CD from scratch",
    level: "For teams without a pipeline",
    summary: "Build a release path from source control to a repeatable deployment, without assuming existing DevOps practices.",
    topics: ["Git branches, pull requests, and review", "Build, test, and artifact stages", "Environment promotion, secrets, rollback, and monitoring"],
    outcome: "Create a first delivery pipeline and a release checklist your team can actually use.",
  },
  {
    id: "infrastructure-as-code",
    number: "03",
    title: "Infrastructure as code",
    level: "Build on the basics",
    summary: "Learn to describe infrastructure changes, review their impact, and keep environments manageable.",
    topics: ["Terraform resources, providers, and variables", "State, plans, modules, and drift", "Safe change review and environment structure"],
    outcome: "Read a plan, identify risky changes, and organize a small reusable configuration.",
  },
];

export const upcomingCohorts = [
  {
    id: "cloud-foundations",
    title: "Cloud foundations for builders",
    focus: "Core concepts, identity, networking, and operating a small cloud environment.",
  },
  {
    id: "devops-foundations",
    title: "Your first CI/CD pipeline",
    focus: "A guided path from source control and tests to a repeatable deployment.",
  },
  {
    id: "infrastructure-as-code",
    title: "Terraform and infrastructure as code",
    focus: "Plan, review, and evolve infrastructure changes with a safer workflow.",
  },
];