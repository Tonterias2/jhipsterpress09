package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Vquestion;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Vquestion entity.
 */
public interface VquestionSearchRepository extends ElasticsearchRepository<Vquestion, Long> {
}
