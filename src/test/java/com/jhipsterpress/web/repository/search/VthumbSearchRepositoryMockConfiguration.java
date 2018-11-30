package com.jhipsterpress.web.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of VthumbSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class VthumbSearchRepositoryMockConfiguration {

    @MockBean
    private VthumbSearchRepository mockVthumbSearchRepository;

}
