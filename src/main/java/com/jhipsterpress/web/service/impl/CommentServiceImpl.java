package com.jhipsterpress.web.service.impl;

import com.jhipsterpress.web.service.CommentService;
import com.jhipsterpress.web.domain.Comment;
import com.jhipsterpress.web.repository.CommentRepository;
import com.jhipsterpress.web.repository.search.CommentSearchRepository;
import com.jhipsterpress.web.service.dto.CommentDTO;
import com.jhipsterpress.web.service.mapper.CommentMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Comment.
 */
@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final Logger log = LoggerFactory.getLogger(CommentServiceImpl.class);

    private final CommentRepository commentRepository;

    private final CommentMapper commentMapper;

    private final CommentSearchRepository commentSearchRepository;

    public CommentServiceImpl(CommentRepository commentRepository, CommentMapper commentMapper, CommentSearchRepository commentSearchRepository) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
        this.commentSearchRepository = commentSearchRepository;
    }

    /**
     * Save a comment.
     *
     * @param commentDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public CommentDTO save(CommentDTO commentDTO) {
        log.debug("Request to save Comment : {}", commentDTO);

        Comment comment = commentMapper.toEntity(commentDTO);
        comment = commentRepository.save(comment);
        CommentDTO result = commentMapper.toDto(comment);
        commentSearchRepository.save(comment);
        return result;
    }

    /**
     * Get all the comments.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<CommentDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Comments");
        return commentRepository.findAll(pageable)
            .map(commentMapper::toDto);
    }


    /**
     * Get one comment by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<CommentDTO> findOne(Long id) {
        log.debug("Request to get Comment : {}", id);
        return commentRepository.findById(id)
            .map(commentMapper::toDto);
    }

    /**
     * Delete the comment by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Comment : {}", id);
        commentRepository.deleteById(id);
        commentSearchRepository.deleteById(id);
    }

    /**
     * Search for the comment corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<CommentDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Comments for query {}", query);
        return commentSearchRepository.search(queryStringQuery(query), pageable)
            .map(commentMapper::toDto);
    }
}
