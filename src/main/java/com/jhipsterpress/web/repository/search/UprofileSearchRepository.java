package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Uprofile;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Uprofile entity.
 */
public interface UprofileSearchRepository extends ElasticsearchRepository<Uprofile, Long> {
}
