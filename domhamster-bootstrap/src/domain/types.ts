declare const brand: unique symbol;

export type Brand<Value, Name extends string> = Value & {
  readonly [brand]: Name;
};

export type RequestId = Brand<string, 'RequestId'>;
export type VolunteerId = Brand<string, 'VolunteerId'>;
export type PlanId = Brand<string, 'PlanId'>;
export type AuditEventId = Brand<string, 'AuditEventId'>;
export type LocalTime = Brand<string, 'LocalTime'>;
export type ScenarioDate = Brand<string, 'ScenarioDate'>;
export type IsoTimestamp = Brand<string, 'IsoTimestamp'>;

function brandedString<Name extends string>(
  value: string,
  pattern: RegExp,
  code: string,
): Brand<string, Name> {
  if (!pattern.test(value)) {
    throw new Error(`${code}:${value}`);
  }
  return value as Brand<string, Name>;
}

export const requestId = (value: string): RequestId =>
  brandedString<'RequestId'>(value, /^R-\d{3}$/, 'INVALID_REQUEST_ID');

export const volunteerId = (value: string): VolunteerId =>
  brandedString<'VolunteerId'>(value, /^V-\d{2}$/, 'INVALID_VOLUNTEER_ID');

export const planId = (value: string): PlanId =>
  brandedString<'PlanId'>(value, /^PLAN-[A-Z0-9-]+$/, 'INVALID_PLAN_ID');

export const auditEventId = (value: string): AuditEventId =>
  brandedString<'AuditEventId'>(value, /^AUDIT-[A-Z0-9-]+$/, 'INVALID_AUDIT_EVENT_ID');

export const localTime = (value: string): LocalTime =>
  brandedString<'LocalTime'>(value, /^(?:[01]\d|2[0-3]):[0-5]\d$/, 'INVALID_LOCAL_TIME');

export const scenarioDate = (value: string): ScenarioDate =>
  brandedString<'ScenarioDate'>(value, /^\d{4}-\d{2}-\d{2}$/, 'INVALID_SCENARIO_DATE');

export const isoTimestamp = (value: string): IsoTimestamp => {
  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`INVALID_ISO_TIMESTAMP:${value}`);
  }
  return value as IsoTimestamp;
};

export const REQUEST_CATEGORIES = [
  'FOOD_DELIVERY',
  'SUPPLY_PICKUP',
  'MOBILITY_SUPPORT',
  'DIGITAL_HELP',
  'TUTORING',
] as const;
export type RequestCategory = (typeof REQUEST_CATEGORIES)[number];

export const PRIORITIES = ['URGENT', 'HIGH', 'NORMAL'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const ZONES = ['CENTRAL', 'EAST', 'SOUTH', 'NORTH'] as const;
export type Zone = (typeof ZONES)[number];

export const SKILLS = [
  'FOOD_DELIVERY',
  'SUPPLY_PICKUP',
  'MOBILITY_SUPPORT',
  'DIGITAL_HELP',
  'TUTORING',
] as const;
export type Skill = (typeof SKILLS)[number];

export const LANGUAGES = ['AR', 'EN', 'UR'] as const;
export type Language = (typeof LANGUAGES)[number];

export const WORKFLOW_STATES = [
  'READY',
  'DRAFT_INVALID',
  'DRAFT_VALID',
  'AWAITING_APPROVAL',
  'APPROVED',
  'COMMITTED',
] as const;
export type WorkflowState = (typeof WORKFLOW_STATES)[number];

export const ACTORS = ['HUMAN', 'AGENT', 'SYSTEM'] as const;
export type Actor = (typeof ACTORS)[number];

export const VALIDATION_CODES = [
  'UNKNOWN_REQUEST',
  'UNKNOWN_VOLUNTEER',
  'INCOMPLETE_REQUEST_ACCOUNTING',
  'DUPLICATE_REQUEST_ASSIGNMENT',
  'TIME_OUTSIDE_REQUEST_WINDOW',
  'OUTSIDE_VOLUNTEER_AVAILABILITY',
  'ASSIGNMENT_OVERLAP',
  'SKILL_MISMATCH',
  'LANGUAGE_MISMATCH',
  'ZONE_MISMATCH',
  'TASK_CAPACITY_EXCEEDED',
  'LOCKED_ASSIGNMENT_CHANGE',
  'REQUEST_UNASSIGNED',
  'URGENT_REQUEST_UNASSIGNED',
  'WORKLOAD_IMBALANCE',
] as const;
export type ValidationCode = (typeof VALIDATION_CODES)[number];

export const AUDIT_EVENT_TYPES = [
  'SCENARIO_RESET',
  'DRAFT_CREATED',
  'DRAFT_REVISED',
  'ASSIGNMENT_LOCKED',
  'ASSIGNMENT_UNLOCKED',
  'DRAFT_DISCARDED',
  'APPROVAL_REQUESTED',
  'APPROVAL_APPROVED',
  'APPROVAL_REJECTED',
  'APPROVAL_CANCELLED',
  'APPROVAL_EXPIRED',
  'APPROVAL_INVALIDATED_RELOAD',
  'PLAN_COMMITTED',
  'CONTACTS_ACCESSED',
] as const;
export type AuditEventType = (typeof AUDIT_EVENT_TYPES)[number];

export interface BoundedNote {
  readonly text: string;
  readonly trust: 'UNTRUSTED';
}

export interface ScenarioPolicy {
  readonly maxTasksPerVolunteer: number;
  readonly priorityOrder: readonly Priority[];
  readonly unassignedRequestsAllowed: true;
  readonly unassignedRequestsProduceWarnings: true;
}

export interface Request {
  readonly id: RequestId;
  readonly category: RequestCategory;
  readonly priority: Priority;
  readonly zone: Zone;
  readonly windowStart: LocalTime;
  readonly windowEnd: LocalTime;
  readonly durationMinutes: number;
  readonly requiredSkills: readonly Skill[];
  readonly requiredLanguages: readonly Language[];
  readonly note: BoundedNote;
  readonly status: 'OPEN';
}

export interface Volunteer {
  readonly id: VolunteerId;
  readonly displayName: string;
  readonly availabilityStart: LocalTime;
  readonly availabilityEnd: LocalTime;
  readonly skills: readonly Skill[];
  readonly languages: readonly Language[];
  readonly serviceZones: readonly Zone[];
  readonly taskLimit: number;
}

export interface PrivateContact {
  readonly fictional: true;
  readonly requestId: RequestId;
  readonly recipientAlias: string;
  readonly fictionalLocation: string;
  readonly fictionalContactChannel: string;
  readonly boundedInstructions: string;
}

export interface ScenarioPayload {
  readonly fixtureVersion: string;
  readonly scenarioDate: ScenarioDate;
  readonly timeZone: 'Asia/Riyadh';
  readonly policy: ScenarioPolicy;
  readonly requests: readonly Request[];
  readonly volunteers: readonly Volunteer[];
  readonly privateContacts: readonly PrivateContact[];
}

export interface Scenario extends ScenarioPayload {
  readonly canonicalHash: string;
}

export interface Assignment {
  readonly requestId: RequestId;
  readonly volunteerId: VolunteerId;
  readonly startTime: LocalTime;
  readonly endTime: LocalTime;
}

export interface AssignmentLock {
  readonly requestId: RequestId;
  readonly volunteerId: VolunteerId;
  readonly startTime: LocalTime;
  readonly lockedAt: IsoTimestamp;
  readonly actor: 'HUMAN';
}

export interface ValidationIssue {
  readonly severity: 'ERROR' | 'WARNING';
  readonly code: ValidationCode;
  readonly message: string;
  readonly requestIds: readonly RequestId[];
  readonly volunteerIds: readonly VolunteerId[];
  readonly remediation: string;
}

export interface DraftPlan {
  readonly version: number;
  readonly assignments: readonly Assignment[];
  readonly unassignedRequestIds: readonly RequestId[];
  readonly locks: readonly AssignmentLock[];
  readonly goal: string;
  readonly rationale: string;
  readonly issues: readonly ValidationIssue[];
  readonly createdAt: IsoTimestamp;
  readonly updatedAt: IsoTimestamp;
}

export interface PendingApprovalRecord {
  readonly status: 'PENDING';
  readonly draftVersion: number;
  readonly requestedAt: IsoTimestamp;
  readonly approvedAt?: never;
  readonly expiresAt?: never;
}

export interface ApprovedApprovalRecord {
  readonly status: 'APPROVED';
  readonly draftVersion: number;
  readonly requestedAt: IsoTimestamp;
  readonly approvedAt: IsoTimestamp;
  readonly expiresAt: IsoTimestamp;
}

export type ApprovalRecord = PendingApprovalRecord | ApprovedApprovalRecord;

export interface CommittedPlan {
  readonly planId: PlanId;
  readonly draftVersion: number;
  readonly assignments: readonly Assignment[];
  readonly unassignedRequestIds: readonly RequestId[];
  readonly acknowledgedWarnings: readonly ValidationIssue[];
  readonly committedAt: IsoTimestamp;
}

export interface AuditEvent {
  readonly id: AuditEventId;
  readonly timestamp: IsoTimestamp;
  readonly actor: Actor;
  readonly type: AuditEventType;
  readonly state: WorkflowState;
  readonly draftVersion?: number;
  readonly boundedRationale?: string;
}

export interface DiagnosticsState {
  readonly persistenceStatus: 'READY' | 'RECOVERED' | 'ERROR';
  readonly recentErrorCodes: readonly string[];
}

interface ApplicationStateBase {
  readonly scenario: Scenario;
  readonly audit: readonly AuditEvent[];
  readonly persistenceVersion: number;
  readonly diagnostics: DiagnosticsState;
}

export interface ReadyState extends ApplicationStateBase {
  readonly workflowState: 'READY';
  readonly draft?: never;
  readonly approval?: never;
  readonly committedPlan?: never;
}

export interface DraftInvalidState extends ApplicationStateBase {
  readonly workflowState: 'DRAFT_INVALID';
  readonly draft: DraftPlan;
  readonly approval?: never;
  readonly committedPlan?: never;
}

export interface DraftValidState extends ApplicationStateBase {
  readonly workflowState: 'DRAFT_VALID';
  readonly draft: DraftPlan;
  readonly approval?: never;
  readonly committedPlan?: never;
}

export interface AwaitingApprovalState extends ApplicationStateBase {
  readonly workflowState: 'AWAITING_APPROVAL';
  readonly draft: DraftPlan;
  readonly approval: PendingApprovalRecord;
  readonly committedPlan?: never;
}

export interface ApprovedState extends ApplicationStateBase {
  readonly workflowState: 'APPROVED';
  readonly draft: DraftPlan;
  readonly approval: ApprovedApprovalRecord;
  readonly committedPlan?: never;
}

export interface CommittedState extends ApplicationStateBase {
  readonly workflowState: 'COMMITTED';
  readonly draft?: never;
  readonly approval?: never;
  readonly committedPlan: CommittedPlan;
}

export type AppState =
  | ReadyState
  | DraftInvalidState
  | DraftValidState
  | AwaitingApprovalState
  | ApprovedState
  | CommittedState;

export interface SuccessResult<Value> {
  readonly ok: true;
  readonly value: Value;
}

export interface FailureResult<Code extends string = string> {
  readonly ok: false;
  readonly error: {
    readonly code: Code;
    readonly message: string;
  };
}

export type Result<Value, Code extends string = string> =
  | SuccessResult<Value>
  | FailureResult<Code>;
