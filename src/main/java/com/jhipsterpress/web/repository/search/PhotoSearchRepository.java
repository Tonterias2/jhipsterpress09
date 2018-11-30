package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Photo;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Photo entity.
 */
public interface PhotoSearchRepository extends ElasticsearchRepository<Photo, Long> {
}
