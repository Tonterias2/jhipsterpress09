package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Newsletter;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Newsletter entity.
 */
public interface NewsletterSearchRepository extends ElasticsearchRepository<Newsletter, Long> {
}
