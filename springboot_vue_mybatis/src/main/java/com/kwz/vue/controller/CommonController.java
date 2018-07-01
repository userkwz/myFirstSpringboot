package com.kwz.vue.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import com.kwz.vue.common.MessageResult;
import com.kwz.vue.pojo.ExcelVo;
import com.kwz.vue.utils.ExportExcelUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 公共接口
 */
@RequestMapping("/common")
@RestController
@Api("公共的一些接口")
public class CommonController {

    @Autowired
    ExportExcelUtils excelUtils;



    @ApiOperation("导出excel")
    @PostMapping("/exportExcel")
    @ResponseBody
    public MessageResult ecxelExport(String json){
        String s= "<a style='cursor:pointer;font-weight:bold'>";
        String s1 = json.replaceAll(s, "");
        String jsonObject = s1.replaceAll("</a>", "");
        String s3 = jsonObject.replaceAll("<span data-index=1 data-field=PCZS class='ypc' onclick=ypc_kp_click(this)>", "");
        String s4 = s3.replaceAll("</span>", "");
        String s5 = s4.replaceAll("<span data-index=0 data-field=PCZS onclick=wpc_kp_click(this) class='wpc'>", "");
        String s6 = s5.replaceAll("<span data-index=1 data-field=PCZS onclick=wpc_kp_click(this) class='wpc'>", "");
        StringBuffer stringBuffer = new StringBuffer(s6);
        String jsonString = getJsonString(stringBuffer);

        JSONObject parse = JSON.parseObject(jsonString);
        JSONArray array = (JSONArray) parse.get("data");

        ExcelVo excelVo = new ExcelVo();
        excelVo.setFileName((String) parse.get("filename"));
        String headerString= (String) parse.get("header");
        String substring = headerString.substring(1, headerString.length() - 1);
        String[] split1 = substring.split(",");
        List<String> head = new ArrayList<>();
        for (String s2 : split1) {
            head.add(s2);
        }
        ArrayList<List<String>> data = new ArrayList<>();
        for (Object o : array) {
            String text= (String) o;
            String[] split = text.split(",");
            ArrayList<String> arrayList = new ArrayList();
            for (String s2 : split) {
                arrayList.add(s2);
            }
            arrayList.remove(0);
             if (arrayList.size()>head.size()){
                 arrayList.remove(1);
             }
            data.add(arrayList);
        }

        excelVo.setHeader(head);
        excelVo.setData(data);
        String fileName = excelUtils.exportExcelData(excelVo);
        return new MessageResult(200,fileName);
    }



    private String getJsonString(StringBuffer text) {
        if (text.indexOf("<")!=-1){
            int start = text.indexOf("<");
            int end = text.indexOf(">") + 1;
            StringBuffer delete = text.delete(start, end);
            String jsonString = getJsonString(delete);
            if (jsonString.indexOf("<")==-1){
                return jsonString;
            }
        }else {
            return text.toString();
        }
        return null;
    }




}
