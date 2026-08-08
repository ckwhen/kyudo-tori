import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { type ActionResponse } from '@/shared/utils/types';
import { ERROR_CODES } from '@/shared/utils/error-handler';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request
): Promise<NextResponse<ActionResponse<{ id: string }>>> {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({
        errorCode: ERROR_CODES.REQUIRED_FIELDS_MISSING
      }, { status: 400 });
    }

    const targetEmail = process.env.CONTACT_EMAIL_ADDRESS;

    if (!targetEmail) {
      console.error('錯誤：未在環境變數中設定 CONTACT_EMAIL_ADDRESS');
      return NextResponse.json({
        errorCode: ERROR_CODES.SYSTEM_UNKNOWN
      }, { status: 500 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Kyudo Tori Contact <onboarding@resend.dev>',
      to: targetEmail,
      subject: `來自 Kyudo-Tori 的聯絡訊息 (${name})`,
      html: `
        <h2>收到新的聯絡表單訊息</h2>
        <p><strong>聯絡人姓名：</strong> ${name}</p>
        <p><strong>聯絡人信箱：</strong> ${email}</p>
        <p><strong>訊息內容：</strong></p>
        <div style="padding: 12px; background-color: #f4f4f5; border: 1px solid #e4e4e7; white-space: pre-wrap;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({
        errorCode: ERROR_CODES.CONTACT_FAILED
      }, { status: 400 });
    }

    return NextResponse.json({
      data: { id: data?.id || '' },
      meta: {}
    });
  } catch (_err) {
    return NextResponse.json({
      errorCode: ERROR_CODES.SYSTEM_UNKNOWN
    }, { status: 500 });
  }
}
