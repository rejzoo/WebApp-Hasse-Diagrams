package com.hassediagrams.rejzo.dto;

import jakarta.validation.constraints.Pattern;
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

    @Pattern(
            regexp = "^(?=.{1,50}$)[A-Za-z0-9][A-Za-z0-9 _-]*$",
            message = "Diagram name must be 1-50 characters long, start with an alphanumeric character, and may only contain letters, numbers, spaces, underscores, and hyphens."
    )
    private String diagram_name;

    @Pattern(
            regexp = "^(public|private)$",
            message = "Visibility must be either 'public' or 'private'"
    )
    private String visibility;
}
