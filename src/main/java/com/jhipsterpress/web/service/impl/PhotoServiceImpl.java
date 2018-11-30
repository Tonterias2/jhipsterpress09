package com.jhipsterpress.web.service.impl;

import com.jhipsterpress.web.service.PhotoService;
import com.jhipsterpress.web.domain.Photo;
import com.jhipsterpress.web.repository.PhotoRepository;
import com.jhipsterpress.web.repository.search.PhotoSearchRepository;
import com.jhipsterpress.web.service.dto.PhotoDTO;
import com.jhipsterpress.web.service.mapper.PhotoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Photo.
 */
@Service
@Transactional
public class PhotoServiceImpl implements PhotoService {

    private final Logger log = LoggerFactory.getLogger(PhotoServiceImpl.class);

    private final PhotoRepository photoRepository;

    private final PhotoMapper photoMapper;

    private final PhotoSearchRepository photoSearchRepository;

    public PhotoServiceImpl(PhotoRepository photoRepository, PhotoMapper photoMapper, PhotoSearchRepository photoSearchRepository) {
        this.photoRepository = photoRepository;
        this.photoMapper = photoMapper;
        this.photoSearchRepository = photoSearchRepository;
    }

    /**
     * Save a photo.
     *
     * @param photoDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public PhotoDTO save(PhotoDTO photoDTO) {
        log.debug("Request to save Photo : {}", photoDTO);

        Photo photo = photoMapper.toEntity(photoDTO);
        photo = photoRepository.save(photo);
        PhotoDTO result = photoMapper.toDto(photo);
        photoSearchRepository.save(photo);
        return result;
    }

    /**
     * Get all the photos.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<PhotoDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Photos");
        return photoRepository.findAll(pageable)
            .map(photoMapper::toDto);
    }


    /**
     * Get one photo by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<PhotoDTO> findOne(Long id) {
        log.debug("Request to get Photo : {}", id);
        return photoRepository.findById(id)
            .map(photoMapper::toDto);
    }

    /**
     * Delete the photo by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Photo : {}", id);
        photoRepository.deleteById(id);
        photoSearchRepository.deleteById(id);
    }

    /**
     * Search for the photo corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<PhotoDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Photos for query {}", query);
        return photoSearchRepository.search(queryStringQuery(query), pageable)
            .map(photoMapper::toDto);
    }
}
