package com.kwz.vue.utils;

import com.kwz.vue.pojo.ExcelVo;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.*;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * excel导出
 */
@Component
public class ExportExcelUtils {

    /**
     * 导出数据
     * @param excelVo
     */
    public String exportExcelData(ExcelVo excelVo)
    {
        List<String> header = excelVo.getHeader();
        String title = excelVo.getFileName();
        List<List<String>> data = excelVo.getData();
        // 声明一个工作薄
        HSSFWorkbook workbook = new HSSFWorkbook();
        // 生成一个表格
        HSSFSheet sheet = workbook.createSheet(title);
        // 设置表格默认列宽度为15个字节
        sheet.setDefaultColumnWidth((short) 15);
        // 生成一个样式
        HSSFCellStyle style = getHssfCellStyle(workbook);
        // 生成并设置另一个样式
        HSSFCellStyle style2 = getHssfCellStyleTwo(workbook);
        getExcelHeader(header, sheet, style);
        HSSFRow row;
        getExcelData(data, workbook, sheet, style2);
        //String wzbsPath = SystemConfiguration.wzbsPath;
        //String filePath =SystemConfiguration.resourcefilepath;
        String filePath = "D:/File/";
        //String path=wzbsPath+filePath;
        String path=filePath;
        if (StringUtils.isNotEmpty(excelVo.getFilePath())){
            path=excelVo.getFilePath();
        }
        String fileName = UUID.randomUUID().toString();
        if (StringUtils.isNotEmpty(excelVo.getFileName())){
            fileName=excelVo.getFileName();
        }
        try {
            File file = new File(path);
            if (!file.exists()){
               file.mkdirs();
           }
            OutputStream out = new FileOutputStream(path+fileName+".xls");
            workbook.write(out);
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return filePath+fileName+".xls";
    }

    private void getExcelData(List<List<String>> data, HSSFWorkbook workbook, HSSFSheet sheet, HSSFCellStyle style2) {
        HSSFRow row;
        if (!data.isEmpty()) {
            int index=0;
            for (int i = 0; i < data.size(); i++) {
                index++;
                row = sheet.createRow(index);
                List<String> rowData = data.get(i);
                if (!rowData.isEmpty()){
                    for (int j = 0; j < rowData.size(); j++) {
                        HSSFCell cell = row.createCell(j);
                        cell.setCellStyle(style2);
                        String cellData = rowData.get(j);

                        if (cellData != null && !cellData.isEmpty()) {
                            Pattern p = Pattern.compile("^//d+(//.//d+)?$");
                            Matcher matcher = p.matcher(cellData);
                            if (matcher.matches()) {
                                // 是数字当作double处理
                                cell.setCellValue(Double.parseDouble(cellData));
                            } else {
                                HSSFRichTextString richString = new HSSFRichTextString(
                                        cellData);
                                HSSFFont font3 = workbook.createFont();
                                richString.applyFont(font3);
                                cell.setCellValue(richString);
                            }
                        }

                    }
                }
            }
        }
    }

    private void getExcelHeader(List<String> header, HSSFSheet sheet, HSSFCellStyle style) {
        // 产生表格标题行
        HSSFRow row = sheet.createRow(0);
        if (!header.isEmpty()){
            for (int i = 0; i < header.size(); i++) {
                HSSFCell cell = row.createCell(i);
                cell.setCellStyle(style);
                HSSFRichTextString text = new HSSFRichTextString(header.get(i));
                cell.setCellValue(text);
            }
        }
    }

    private HSSFCellStyle getHssfCellStyleTwo(HSSFWorkbook workbook) {
        HSSFCellStyle style2 = workbook.createCellStyle();
        style2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style2.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style2.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        // 生成另一个字体
        HSSFFont font2 = workbook.createFont();
        // 把字体应用到当前的样式
        style2.setFont(font2);
        return style2;
    }

    private HSSFCellStyle getHssfCellStyle(HSSFWorkbook workbook) {
        HSSFCellStyle style = workbook.createCellStyle();
        // 设置这些样式
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        // 生成一个字体
        HSSFFont font = workbook.createFont();
        font.setFontHeightInPoints((short) 12);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        // 把字体应用到当前的样式
        style.setFont(font);
        return style;
    }

    /**
     * @Description 上传文件生成UUID文件夹
     * @param saveFilename
     * @param savePath
     * @return
     */
    public static String makePath(String saveFilename, String savePath) {

        String dir = savePath + UUID.randomUUID(); // savePath/dir1
        File file = new File(dir);
        if (!file.exists()) {
            file.mkdirs();
        }
        return dir;
    }
}  