package com.jhipsterpress.web.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of TopicSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class TopicSearchRepositoryMockConfiguration {

    @MockBean
    private TopicSearchRepository mockTopicSearchRepository;

}
