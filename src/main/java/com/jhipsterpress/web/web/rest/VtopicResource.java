package com.jhipsterpress.web.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jhipsterpress.web.service.VtopicService;
import com.jhipsterpress.web.web.rest.errors.BadRequestAlertException;
import com.jhipsterpress.web.web.rest.util.HeaderUtil;
import com.jhipsterpress.web.web.rest.util.PaginationUtil;
import com.jhipsterpress.web.service.dto.VtopicDTO;
import com.jhipsterpress.web.service.dto.VtopicCriteria;
import com.jhipsterpress.web.service.VtopicQueryService;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Vtopic.
 */
@RestController
@RequestMapping("/api")
public class VtopicResource {

    private final Logger log = LoggerFactory.getLogger(VtopicResource.class);

    private static final String ENTITY_NAME = "vtopic";

    private final VtopicService vtopicService;

    private final VtopicQueryService vtopicQueryService;

    public VtopicResource(VtopicService vtopicService, VtopicQueryService vtopicQueryService) {
        this.vtopicService = vtopicService;
        this.vtopicQueryService = vtopicQueryService;
    }

    /**
     * POST  /vtopics : Create a new vtopic.
     *
     * @param vtopicDTO the vtopicDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new vtopicDTO, or with status 400 (Bad Request) if the vtopic has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/vtopics")
    @Timed
    public ResponseEntity<VtopicDTO> createVtopic(@Valid @RequestBody VtopicDTO vtopicDTO) throws URISyntaxException {
        log.debug("REST request to save Vtopic : {}", vtopicDTO);
        if (vtopicDTO.getId() != null) {
            throw new BadRequestAlertException("A new vtopic cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VtopicDTO result = vtopicService.save(vtopicDTO);
        return ResponseEntity.created(new URI("/api/vtopics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /vtopics : Updates an existing vtopic.
     *
     * @param vtopicDTO the vtopicDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated vtopicDTO,
     * or with status 400 (Bad Request) if the vtopicDTO is not valid,
     * or with status 500 (Internal Server Error) if the vtopicDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/vtopics")
    @Timed
    public ResponseEntity<VtopicDTO> updateVtopic(@Valid @RequestBody VtopicDTO vtopicDTO) throws URISyntaxException {
        log.debug("REST request to update Vtopic : {}", vtopicDTO);
        if (vtopicDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        VtopicDTO result = vtopicService.save(vtopicDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, vtopicDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /vtopics : get all the vtopics.
     *
     * @param pageable the pagination information
     * @param criteria the criterias which the requested entities should match
     * @return the ResponseEntity with status 200 (OK) and the list of vtopics in body
     */
    @GetMapping("/vtopics")
    @Timed
    public ResponseEntity<List<VtopicDTO>> getAllVtopics(VtopicCriteria criteria, Pageable pageable) {
        log.debug("REST request to get Vtopics by criteria: {}", criteria);
        Page<VtopicDTO> page = vtopicQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/vtopics");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
    * GET  /vtopics/count : count all the vtopics.
    *
    * @param criteria the criterias which the requested entities should match
    * @return the ResponseEntity with status 200 (OK) and the count in body
    */
    @GetMapping("/vtopics/count")
    @Timed
    public ResponseEntity<Long> countVtopics(VtopicCriteria criteria) {
        log.debug("REST request to count Vtopics by criteria: {}", criteria);
        return ResponseEntity.ok().body(vtopicQueryService.countByCriteria(criteria));
    }

    /**
     * GET  /vtopics/:id : get the "id" vtopic.
     *
     * @param id the id of the vtopicDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the vtopicDTO, or with status 404 (Not Found)
     */
    @GetMapping("/vtopics/{id}")
    @Timed
    public ResponseEntity<VtopicDTO> getVtopic(@PathVariable Long id) {
        log.debug("REST request to get Vtopic : {}", id);
        Optional<VtopicDTO> vtopicDTO = vtopicService.findOne(id);
        return ResponseUtil.wrapOrNotFound(vtopicDTO);
    }

    /**
     * DELETE  /vtopics/:id : delete the "id" vtopic.
     *
     * @param id the id of the vtopicDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/vtopics/{id}")
    @Timed
    public ResponseEntity<Void> deleteVtopic(@PathVariable Long id) {
        log.debug("REST request to delete Vtopic : {}", id);
        vtopicService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/vtopics?query=:query : search for the vtopic corresponding
     * to the query.
     *
     * @param query the query of the vtopic search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/vtopics")
    @Timed
    public ResponseEntity<List<VtopicDTO>> searchVtopics(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Vtopics for query {}", query);
        Page<VtopicDTO> page = vtopicService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/vtopics");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
