# EdiReg

EdiReg supports the front-desk operations of a residential building or condominium. Its core language distinguishes the people, places, and records involved in visits, package reception, and visitor parking.

## People and roles

**Administrator**:
A staff member with authority to manage operational configuration and building records.
_Avoid_: Admin user, superuser

**Concierge**:
A front-desk staff member who records visits and packages and manages visitor parking during day-to-day operations.
_Avoid_: Receptionist, operator

**Resident**:
A person associated with one Residence and eligible to receive package notifications.
_Avoid_: Tenant, occupant, user

**Visitor**:
A person entering the building who is not acting as a Resident or Concierge.
_Avoid_: Guest

**Frequent Visitor**:
A Visitor whose identifying details and usual Residence are retained for faster future registration.
_Avoid_: Regular visitor

## Building operations

**Residence**:
A numbered dwelling unit in the building, associated with zero or more Residents.
_Avoid_: Apartment, unit

**Visit Record**:
A recorded entrance of a Visitor to a Residence, optionally associated with a Visitor Parking Space.
_Avoid_: Visitor log, visit registry

**Visitor Parking Space**:
A parking space reserved for a Visitor's vehicle and tracked while it is in use.
_Avoid_: Parking spot, visitor parking

**Package**:
A delivery received at the front desk for a Residence, with its receipt status and courier details recorded.
_Avoid_: Delivery

**Parking Alert**:
A notice that a Visitor Parking Space is approaching its configured time limit.
_Avoid_: Timer notification
