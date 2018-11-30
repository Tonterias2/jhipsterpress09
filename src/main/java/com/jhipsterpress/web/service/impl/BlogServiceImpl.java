package com.jhipsterpress.web.service.impl;

import com.jhipsterpress.web.service.BlogService;
import com.jhipsterpress.web.domain.Blog;
import com.jhipsterpress.web.repository.BlogRepository;
import com.jhipsterpress.web.repository.search.BlogSearchRepository;
import com.jhipsterpress.web.service.dto.BlogDTO;
import com.jhipsterpress.web.service.mapper.BlogMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Blog.
 */
@Service
@Transactional
public class BlogServiceImpl implements BlogService {

    private final Logger log = LoggerFactory.getLogger(BlogServiceImpl.class);

    private final BlogRepository blogRepository;

    private final BlogMapper blogMapper;

    private final BlogSearchRepository blogSearchRepository;

    public BlogServiceImpl(BlogRepository blogRepository, BlogMapper blogMapper, BlogSearchRepository blogSearchRepository) {
        this.blogRepository = blogRepository;
        this.blogMapper = blogMapper;
        this.blogSearchRepository = blogSearchRepository;
    }

    /**
     * Save a blog.
     *
     * @param blogDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public BlogDTO save(BlogDTO blogDTO) {
        log.debug("Request to save Blog : {}", blogDTO);

        Blog blog = blogMapper.toEntity(blogDTO);
        blog = blogRepository.save(blog);
        BlogDTO result = blogMapper.toDto(blog);
        blogSearchRepository.save(blog);
        return result;
    }

    /**
     * Get all the blogs.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<BlogDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Blogs");
        return blogRepository.findAll(pageable)
            .map(blogMapper::toDto);
    }


    /**
     * Get one blog by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<BlogDTO> findOne(Long id) {
        log.debug("Request to get Blog : {}", id);
        return blogRepository.findById(id)
            .map(blogMapper::toDto);
    }

    /**
     * Delete the blog by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Blog : {}", id);
        blogRepository.deleteById(id);
        blogSearchRepository.deleteById(id);
    }

    /**
     * Search for the blog corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<BlogDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Blogs for query {}", query);
        return blogSearchRepository.search(queryStringQuery(query), pageable)
            .map(blogMapper::toDto);
    }
}
