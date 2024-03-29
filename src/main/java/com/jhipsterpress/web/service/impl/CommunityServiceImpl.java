package com.jhipsterpress.web.service.impl;

import com.jhipsterpress.web.service.CommunityService;
import com.jhipsterpress.web.domain.Cactivity;
import com.jhipsterpress.web.domain.Cceleb;
import com.jhipsterpress.web.domain.Cinterest;
import com.jhipsterpress.web.domain.Community;
import com.jhipsterpress.web.repository.CommunityRepository;
import com.jhipsterpress.web.repository.search.CommunitySearchRepository;
import com.jhipsterpress.web.service.dto.CommunityDTO;
import com.jhipsterpress.web.service.mapper.CommunityMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Optional;
import java.util.Set;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Community.
 */
@Service
@Transactional
public class CommunityServiceImpl implements CommunityService {

    private final Logger log = LoggerFactory.getLogger(CommunityServiceImpl.class);

    private final CommunityRepository communityRepository;

    private final CommunityMapper communityMapper;

    private final CommunitySearchRepository communitySearchRepository;

    public CommunityServiceImpl(CommunityRepository communityRepository, CommunityMapper communityMapper, CommunitySearchRepository communitySearchRepository) {
        this.communityRepository = communityRepository;
        this.communityMapper = communityMapper;
        this.communitySearchRepository = communitySearchRepository;
    }

    /**
     * Save a community.
     *
     * @param communityDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public CommunityDTO save(CommunityDTO communityDTO) {
        log.debug("Request to save Community : {}", communityDTO);

        Community community = communityMapper.toEntity(communityDTO);
        community = communityRepository.save(community);
        CommunityDTO result = communityMapper.toDto(community);
        communitySearchRepository.save(community);
        return result;
    }

    /**
     * Get all the communities.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<CommunityDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Communities");
        return communityRepository.findAll(pageable)
            .map(communityMapper::toDto);
    }


    /**
     * Get one community by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<CommunityDTO> findOne(Long id) {
        log.debug("Request to get Community : {}", id);
        return communityRepository.findById(id)
            .map(communityMapper::toDto);
    }

    /**
     * Delete the community by id, but deleting Many2Many relationships ans saving the entity before deleting it.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Community : {}", id);
        Optional<Community> communityOpt = communityRepository.findById(id);
        Community community = communityOpt.get();

		ArrayList<Cinterest> arrayCinterests = new ArrayList<Cinterest>();
		arrayCinterests.addAll(community.getCinterests());
		Iterator<Cinterest> copyOfCinterests = arrayCinterests.iterator();
		while (copyOfCinterests.hasNext()) {
			Cinterest cinterest = copyOfCinterests.next();
			cinterest.removeCommunity(community);
		}

		ArrayList<Cactivity> arrayCactivities = new ArrayList<Cactivity>();
		arrayCactivities.addAll(community.getCactivities());
		Iterator<Cactivity> copyOfCactivities = arrayCactivities.iterator();
		while (copyOfCactivities.hasNext()) {
			Cactivity cactivity = copyOfCactivities.next();
			cactivity.removeCommunity(community);
		}

		ArrayList<Cceleb> arrayCcelebs = new ArrayList<Cceleb>();
		arrayCcelebs.addAll(community.getCcelebs());
		Iterator<Cceleb> copyOfCcelebs = arrayCcelebs.iterator();
		while (copyOfCcelebs.hasNext()) {
			Cceleb cceleb = copyOfCcelebs.next();
			cceleb.removeCommunity(community);
		}
        
		communityRepository.save(community);
		
        communityRepository.deleteById(id);
        communitySearchRepository.deleteById(id);
    }

    /**
     * Search for the community corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<CommunityDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Communities for query {}", query);
        return communitySearchRepository.search(queryStringQuery(query), pageable)
            .map(communityMapper::toDto);
    }
}
