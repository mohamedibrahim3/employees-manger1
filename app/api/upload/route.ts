import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // الحصول على البيانات من النموذج
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم العثور على ملف' },
        { status: 400 }
      );
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'يجب أن يكون الملف صورة' },
        { status: 400 }
      );
    }

    // التحقق من حجم الملف (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'حجم الملف كبير جداً. الحد الأقصى 2 ميجابايت' },
        { status: 400 }
      );
    }

    // إنشاء مجلد التحميل إذا لم يكن موجوداً
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // إنشاء اسم ملف فريد
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = path.extname(file.name);
    const fileName = `${timestamp}-${randomString}${fileExtension}`;

    // تحويل الملف إلى Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // حفظ الملف
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // إرجاع رابط الملف
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      success: true,
      url: fileUrl,
      message: 'تم رفع الصورة بنجاح'
    });

  } catch (error) {
    console.error('خطأ في رفع الملف:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في رفع الملف' },
      { status: 500 }
    );
  }
}