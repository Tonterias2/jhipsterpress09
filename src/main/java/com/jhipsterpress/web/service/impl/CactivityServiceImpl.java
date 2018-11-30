package com.jhipsterpress.web.service.impl;

import com.jhipsterpress.web.service.CactivityService;
import com.jhipsterpress.web.domain.Cactivity;
import com.jhipsterpress.web.repository.CactivityRepository;
import com.jhipsterpress.web.repository.search.CactivitySearchRepository;
import com.jhipsterpress.web.service.dto.CactivityDTO;
import com.jhipsterpress.web.service.mapper.CactivityMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Cactivity.
 */
@Service
@Transactional
public class CactivityServiceImpl implements CactivityService {

    private final Logger log = LoggerFactory.getLogger(CactivityServiceImpl.class);

    private final CactivityRepository cactivityRepository;

    private final CactivityMapper cactivityMapper;

    private final CactivitySearchRepository cactivitySearchRepository;

    public CactivityServiceImpl(CactivityRepository cactivityRepository, CactivityMapper cactivityMapper, CactivitySearchRepository cactivitySearchRepository) {
        this.cactivityRepository = cactivityRepository;
        this.cactivityMapper = cactivityMapper;
        this.cactivitySearchRepository = cactivitySearchRepository;
    }

    /**
     * Save a cactivity.
     *
     * @param cactivityDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public CactivityDTO save(CactivityDTO cactivityDTO) {
        log.debug("Request to save Cactivity : {}", cactivityDTO);

        Cactivity cactivity = cactivityMapper.toEntity(cactivityDTO);
        cactivity = cactivityRepository.save(cactivity);
        CactivityDTO result = cactivityMapper.toDto(cactivity);
        cactivitySearchRepository.save(cactivity);
        return result;
    }

    /**
     * Get all the cactivities.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<CactivityDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Cactivities");
        return cactivityRepository.findAll(pageable)
            .map(cactivityMapper::toDto);
    }

    /**
     * Get all the Cactivity with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    public Page<CactivityDTO> findAllWithEagerRelationships(Pageable pageable) {
        return cactivityRepository.findAllWithEagerRelationships(pageable).map(cactivityMapper::toDto);
    }
    

    /**
     * Get one cactivity by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<CactivityDTO> findOne(Long id) {
        log.debug("Request to get Cactivity : {}", id);
        return cactivityRepository.findOneWithEagerRelationships(id)
            .map(cactivityMapper::toDto);
    }

    /**
     * Delete the cactivity by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Cactivity : {}", id);
        cactivityRepository.deleteById(id);
        cactivitySearchRepository.deleteById(id);
    }

    /**
     * Search for the cactivity corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<CactivityDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Cactivities for query {}", query);
        return cactivitySearchRepository.search(queryStringQuery(query), pageable)
            .map(cactivityMapper::toDto);
    }
}
