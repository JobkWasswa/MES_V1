// Shared state management for authentication and operators
let activeOperatorPhone: string | null = null;

export function setActiveOperatorPhone(phone: string) {
  activeOperatorPhone = phone;
}

export function getActiveOperatorPhone(): string | null {
  return activeOperatorPhone;
}

export async function authenticateOperator(phone: string, pin: string): Promise<{ success: boolean; token?: string }> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, pin }),
    });

    if (response.ok) {
      const data = await response.json();
      setActiveOperatorPhone(phone);
      return { success: true, token: data.token };
    }
    return { success: false };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false };
  }
}
