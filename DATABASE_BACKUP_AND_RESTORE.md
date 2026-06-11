# Database Backup and Restore

Use this guide for the MySQL database that stores FAQ and category content.
Never commit backup files because they may contain unpublished content or
administrative data.

## Before You Begin

- Confirm the database host permits `mysqldump` and `mysql` connections.
- Store credentials in environment variables or enter the password when
  prompted. Do not put passwords directly in shell history.
- Create backups from a trusted computer using an encrypted drive or approved
  secure storage.

## Create a Backup

```bash
mkdir -p backups

mysqldump \
  --host="$DB_HOST" \
  --port="${DB_PORT:-3306}" \
  --user="$DB_USER" \
  --password \
  --single-transaction \
  --routines \
  --triggers \
  "$DB_NAME" > "backups/runningstart-$(date +%Y-%m-%d).sql"
```

Verify that the file exists and is not empty:

```bash
ls -lh backups/
```

## Restore a Backup

Restore into a test database first. A restore replaces database state and should
not be run against production without approval and a fresh backup.

```sql
CREATE DATABASE runningstart_restore_test;
```

```bash
mysql \
  --host="$DB_HOST" \
  --port="${DB_PORT:-3306}" \
  --user="$DB_USER" \
  --password \
  runningstart_restore_test < backups/runningstart-YYYY-MM-DD.sql
```

After restoring, point a non-production backend at the test database and verify:

1. `GET /api/health` reports a connected database.
2. Current and future FAQs load.
3. Categories match their FAQs.
4. Admin create, edit, reorder, hide, and delete workflows work.
5. `npm run migrate` reports that migrations are up to date.

## Recommended Schedule

- Back up before migrations or large content changes.
- Keep automated daily backups for production when the database provider
  supports them.
- Retain at least one monthly backup separately from daily backups.
- Test a restore at least once per quarter.
- Document who owns backup monitoring and restore approval.

Add `backups/` to local ignore rules if backup commands are used in this
repository.
