package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Post;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Post entity.
 */
public interface PostSearchRepository extends ElasticsearchRepository<Post, Long> {
}
