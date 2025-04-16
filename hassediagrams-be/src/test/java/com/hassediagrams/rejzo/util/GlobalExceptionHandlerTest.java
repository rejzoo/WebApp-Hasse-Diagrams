package com.hassediagrams.rejzo.util;

import org.junit.jupiter.api.Test;
import java.lang.reflect.Method;
import java.util.Map;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class GlobalExceptionHandlerTest {

    @Test
    public void testHandleValidationExceptions() {
        Object target = new Object() {
            private String field;
            public String getField() { return field; }
            public void setField(String field) { this.field = field; }
        };

        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(target, "target");
        bindingResult.rejectValue("field", "error.code", "Field is required");

        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(null, bindingResult);

        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        ResponseEntity<Map<String, String>> response = handler.handleValidationExceptions(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, String> errors = response.getBody();
        assertNotNull(errors);
        assertEquals("Field is required", errors.get("field"));
    }
}
