package com.kwz.vue.support.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public final class DataEncryption {
    // 默认密钥
    private final static byte[] KEY = new byte[]{10, 13, 39, 27, 32, 12, 63, 55};


    // 对字节做异或操作
    private static byte ByteXor(byte b, byte key) {
        b = (byte) (b ^ key);
        return b;
    }

    private static byte[] ByteXor(byte[] data, byte[] key) {
        int keyLen = key.length;
        int dataLen = data.length;
        if (dataLen == 0) {
            return data;
        }
        for (int i = 0; i < dataLen; i++) {
            data[i] = ByteXor(data[i], key[i % keyLen]);
        }
        return data;
    }

    /// <summary>
    /// 加密，key必须是2的n次方
    /// </summary>
    public static byte[] Encryption(byte[] data, byte[] key) {
        return ByteXor(data, key);
    }

    /// <summary>
    /// 加密, 使用内置密钥
    /// </summary>
    public static byte[] Encryption(byte[] data) {
        return ByteXor(data, KEY);
    }

    /// <summary>
    /// 加密文件
    /// </summary>
    /// <param name="srcFile">明文文件</param>
    /// <param name="descFile">密文文件</param>
    /// <param name="key">密钥</param>
    public static void Encryption(String srcFile, String descFile, byte[] key) {
        File fs = new File(srcFile);
        File newfs = new File(descFile);
        int count = 0;
        int keyLen = key.length;
        byte[] buffer = new byte[1024 * 512];
        FileInputStream fileInputStream = null;
        FileOutputStream outFileInputStream = null;
        try {
            fileInputStream = new FileInputStream(fs);
            File dirPath = newfs.getParentFile();
            if (!dirPath.exists()) {
                dirPath.mkdirs();
            }
            outFileInputStream = new FileOutputStream(newfs);
            while ((count = fileInputStream.read(buffer)) != -1) {
                for (int i = 0; i < count; i++) {
                    buffer[i] = ByteXor(buffer[i], key[i % keyLen]);
                    outFileInputStream.write(buffer[i]);
                }
            }
            //u关闭流
            fileInputStream.close();
            outFileInputStream.flush();
            outFileInputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                fileInputStream.close();
                outFileInputStream.flush();
                outFileInputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /// <summary>
    /// 加密文件, 使用内置密钥
    /// </summary>
    /// <param name="srcFile">明文文件</param>
    /// <param name="descFile">密文文件</param>
    public static void Encryption(String srcFile, String descFile) {
        Encryption(srcFile, descFile, KEY);
    }


    /// <summary>
    /// 解密
    /// </summary>
    public static byte[] Decryption(byte[] data, byte[] key) {
        return ByteXor(data, key);
    }

    /// <summary>
    /// 解密, 使用内置密钥
    /// </summary>
    public static byte[] Decryption(byte[] data) {
        return ByteXor(data, KEY);
    }


    /// <summary>
    /// 解密文件
    /// </summary>
    /// <param name="srcFile">密文文件</param>
    /// <param name="descFile">解密后的文件</param>
    /// <param name="key">密钥</param>
    public static void Decryption(String srcFile, String descFile, byte[] key) {
        Encryption(srcFile, descFile, key);
    }

    /// <summary>
    /// 解密文件, 使用内置密钥
    /// </summary>
    /// <param name="srcFile">密文文件</param>
    /// <param name="descFile">解密后的文件</param>
    public static void Decryption(String srcFile, String descFile) {
        Decryption(srcFile, descFile, KEY);
    }

    /// <summary>
    /// 根据文件路径判断是否加密文件
    /// </summary>
    /// <param name="srcFile">文件路径</param>
    /// <returns></returns>
    public static boolean JudgeIsEncryFile(String srcFile) {
        return srcFile.lastIndexOf(".encry") > 0;
    }
}
