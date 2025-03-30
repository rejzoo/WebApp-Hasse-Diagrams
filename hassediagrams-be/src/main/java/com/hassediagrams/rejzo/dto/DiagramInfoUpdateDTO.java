package com.hassediagrams.rejzo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Class which holds diagram information to be updated
 */
@NoArgsConstructor
@Getter
@Setter
public class DiagramInfoUpdateDTO {
    private String diagram_name;
    private String visibility;
}
