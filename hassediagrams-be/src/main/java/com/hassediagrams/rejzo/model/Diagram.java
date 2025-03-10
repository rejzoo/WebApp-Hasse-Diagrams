package com.hassediagrams.rejzo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "diagrams")
@Getter
@Setter
@AllArgsConstructor
public class Diagram {

    @Id
    private Integer diagram_id;

    private Integer user_id;

    private String diagram;

    private Diagram() {}
}
