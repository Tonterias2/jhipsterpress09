package com.jhipsterpress.web.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Vtopic.
 */
@Entity
@Table(name = "vtopic")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "vtopic")
public class Vtopic implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "creation_date", nullable = false)
    private Instant creationDate;

    @NotNull
    @Size(min = 2, max = 50)
    @Column(name = "vtopictitle", length = 50, nullable = false)
    private String vtopictitle;

    @Size(min = 2, max = 250)
    @Column(name = "vtopicdesc", length = 250)
    private String vtopicdesc;

    @OneToMany(mappedBy = "vtopic", cascade = CascadeType.REMOVE)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Vquestion> vquestions = new HashSet<>();
    
    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreationDate() {
        return creationDate;
    }

    public Vtopic creationDate(Instant creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public String getVtopictitle() {
        return vtopictitle;
    }

    public Vtopic vtopictitle(String vtopictitle) {
        this.vtopictitle = vtopictitle;
        return this;
    }

    public void setVtopictitle(String vtopictitle) {
        this.vtopictitle = vtopictitle;
    }

    public String getVtopicdesc() {
        return vtopicdesc;
    }

    public Vtopic vtopicdesc(String vtopicdesc) {
        this.vtopicdesc = vtopicdesc;
        return this;
    }

    public void setVtopicdesc(String vtopicdesc) {
        this.vtopicdesc = vtopicdesc;
    }

    public Set<Vquestion> getVquestions() {
        return vquestions;
    }

    public Vtopic vquestions(Set<Vquestion> vquestions) {
        this.vquestions = vquestions;
        return this;
    }

    public Vtopic addVquestion(Vquestion vquestion) {
        this.vquestions.add(vquestion);
        vquestion.setVtopic(this);
        return this;
    }

    public Vtopic removeVquestion(Vquestion vquestion) {
        this.vquestions.remove(vquestion);
        vquestion.setVtopic(null);
        return this;
    }

    public void setVquestions(Set<Vquestion> vquestions) {
        this.vquestions = vquestions;
    }

    public User getUser() {
        return user;
    }

    public Vtopic user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Vtopic vtopic = (Vtopic) o;
        if (vtopic.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), vtopic.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Vtopic{" +
            "id=" + getId() +
            ", creationDate='" + getCreationDate() + "'" +
            ", vtopictitle='" + getVtopictitle() + "'" +
            ", vtopicdesc='" + getVtopicdesc() + "'" +
            "}";
    }
}
