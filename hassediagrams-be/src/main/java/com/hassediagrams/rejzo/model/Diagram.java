package com.hassediagrams.rejzo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "diagrams")
@Getter
@Setter
public class Diagram {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer diagram_id;

    private Integer user_id;

    private String diagram;

    private Diagram() {}

    public Diagram(Integer user_id, String diagram) {
        this.user_id = user_id;
        this.diagram = diagram;
    }
}
