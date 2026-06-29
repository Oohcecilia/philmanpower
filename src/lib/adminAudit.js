import jsonService from '@/lib/jsonService';

export async function logAudit({ action, section, description, previousValue, newValue }) {
  try {
    const user = await jsonService.auth.me();
    const entity = await jsonService.getEntity('AuditLog');
    await entity.create({
      user_email: user.email,
      action,
      section,
      description,
      previous_value: previousValue ? JSON.stringify(previousValue).slice(0, 500) : "",
      new_value: newValue ? JSON.stringify(newValue).slice(0, 500) : "",
    });
  } catch (_) {}
}
