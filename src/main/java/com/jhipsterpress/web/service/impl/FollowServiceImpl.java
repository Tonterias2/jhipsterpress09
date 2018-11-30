package com.jhipsterpress.web.service.impl;

import com.jhipsterpress.web.service.FollowService;
import com.jhipsterpress.web.domain.Follow;
import com.jhipsterpress.web.repository.FollowRepository;
import com.jhipsterpress.web.repository.search.FollowSearchRepository;
import com.jhipsterpress.web.service.dto.FollowDTO;
import com.jhipsterpress.web.service.mapper.FollowMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Follow.
 */
@Service
@Transactional
public class FollowServiceImpl implements FollowService {

    private final Logger log = LoggerFactory.getLogger(FollowServiceImpl.class);

    private final FollowRepository followRepository;

    private final FollowMapper followMapper;

    private final FollowSearchRepository followSearchRepository;

    public FollowServiceImpl(FollowRepository followRepository, FollowMapper followMapper, FollowSearchRepository followSearchRepository) {
        this.followRepository = followRepository;
        this.followMapper = followMapper;
        this.followSearchRepository = followSearchRepository;
    }

    /**
     * Save a follow.
     *
     * @param followDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public FollowDTO save(FollowDTO followDTO) {
        log.debug("Request to save Follow : {}", followDTO);

        Follow follow = followMapper.toEntity(followDTO);
        follow = followRepository.save(follow);
        FollowDTO result = followMapper.toDto(follow);
        followSearchRepository.save(follow);
        return result;
    }

    /**
     * Get all the follows.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<FollowDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Follows");
        return followRepository.findAll(pageable)
            .map(followMapper::toDto);
    }


    /**
     * Get one follow by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<FollowDTO> findOne(Long id) {
        log.debug("Request to get Follow : {}", id);
        return followRepository.findById(id)
            .map(followMapper::toDto);
    }

    /**
     * Delete the follow by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Follow : {}", id);
        followRepository.deleteById(id);
        followSearchRepository.deleteById(id);
    }

    /**
     * Search for the follow corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<FollowDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Follows for query {}", query);
        return followSearchRepository.search(queryStringQuery(query), pageable)
            .map(followMapper::toDto);
    }
}
