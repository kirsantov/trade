import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Валидация обязательных полей
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Имя и email обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Создаем transporter для отправки email
    // Здесь используется простой SMTP для демонстрации
    // В продакшене нужно настроить реальный SMTP сервер или сервис
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // или другой SMTP
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    });

    // Формируем письмо
    const mailOptions = {
      from: email,
      to: 'info@trade.kg',
      subject: subject || 'Обращение с сайта Single Window',
      html: `
        <h3>Новое сообщение с сайта</h3>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Тема:</strong> ${subject || 'Не указана'}</p>
        <h4>Сообщение:</h4>
        <p>${message || 'Сообщение не заполнено'}</p>
        <hr>
        <p><small>Отправлено с сайта Single Window</small></p>
      `,
      text: `
Новое сообщение с сайта

Имя: ${name}
Email: ${email}  
Тема: ${subject || 'Не указана'}

Сообщение:
${message || 'Сообщение не заполнено'}

Отправлено с сайта Single Window
      `
    };

    // Отправляем письмо
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Сообщение успешно отправлено' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Ошибка отправки email:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке сообщения' },
      { status: 500 }
    );
  }
}