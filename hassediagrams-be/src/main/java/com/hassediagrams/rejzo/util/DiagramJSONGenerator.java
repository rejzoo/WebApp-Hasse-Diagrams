package com.hassediagrams.rejzo.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hassediagrams.rejzo.dto.DiagramData;

public class DiagramJSONGenerator {
    /**
     * Converts DiagramData into JSON
     *
     * @param diagramData the diagram data to convert
     * @return JSON string representing the diagram data
     */
    public static String generateDiagramJson(DiagramData diagramData) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(diagramData);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{}";
        }
    }
}
