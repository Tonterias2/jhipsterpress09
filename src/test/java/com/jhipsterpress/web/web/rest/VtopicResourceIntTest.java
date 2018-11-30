package com.jhipsterpress.web.web.rest;

import com.jhipsterpress.web.JhipsterpressApp;

import com.jhipsterpress.web.domain.Vtopic;
import com.jhipsterpress.web.domain.Vquestion;
import com.jhipsterpress.web.domain.User;
import com.jhipsterpress.web.repository.VtopicRepository;
import com.jhipsterpress.web.repository.search.VtopicSearchRepository;
import com.jhipsterpress.web.service.VtopicService;
import com.jhipsterpress.web.service.dto.VtopicDTO;
import com.jhipsterpress.web.service.mapper.VtopicMapper;
import com.jhipsterpress.web.web.rest.errors.ExceptionTranslator;
import com.jhipsterpress.web.service.dto.VtopicCriteria;
import com.jhipsterpress.web.service.VtopicQueryService;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;


import static com.jhipsterpress.web.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the VtopicResource REST controller.
 *
 * @see VtopicResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = JhipsterpressApp.class)
public class VtopicResourceIntTest {

    private static final Instant DEFAULT_CREATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_VTOPICTITLE = "AAAAAAAAAA";
    private static final String UPDATED_VTOPICTITLE = "BBBBBBBBBB";

    private static final String DEFAULT_VTOPICDESC = "AAAAAAAAAA";
    private static final String UPDATED_VTOPICDESC = "BBBBBBBBBB";

    @Autowired
    private VtopicRepository vtopicRepository;

    @Autowired
    private VtopicMapper vtopicMapper;

    @Autowired
    private VtopicService vtopicService;

    /**
     * This repository is mocked in the com.jhipsterpress.web.repository.search test package.
     *
     * @see com.jhipsterpress.web.repository.search.VtopicSearchRepositoryMockConfiguration
     */
    @Autowired
    private VtopicSearchRepository mockVtopicSearchRepository;

    @Autowired
    private VtopicQueryService vtopicQueryService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restVtopicMockMvc;

    private Vtopic vtopic;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final VtopicResource vtopicResource = new VtopicResource(vtopicService, vtopicQueryService);
        this.restVtopicMockMvc = MockMvcBuilders.standaloneSetup(vtopicResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vtopic createEntity(EntityManager em) {
        Vtopic vtopic = new Vtopic()
            .creationDate(DEFAULT_CREATION_DATE)
            .vtopictitle(DEFAULT_VTOPICTITLE)
            .vtopicdesc(DEFAULT_VTOPICDESC);
        // Add required entity
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        em.flush();
        vtopic.setUser(user);
        return vtopic;
    }

    @Before
    public void initTest() {
        vtopic = createEntity(em);
    }

    @Test
    @Transactional
    public void createVtopic() throws Exception {
        int databaseSizeBeforeCreate = vtopicRepository.findAll().size();

        // Create the Vtopic
        VtopicDTO vtopicDTO = vtopicMapper.toDto(vtopic);
        restVtopicMockMvc.perform(post("/api/vtopics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vtopicDTO)))
            .andExpect(status().isCreated());

        // Validate the Vtopic in the database
        List<Vtopic> vtopicList = vtopicRepository.findAll();
        assertThat(vtopicList).hasSize(databaseSizeBeforeCreate + 1);
        Vtopic testVtopic = vtopicList.get(vtopicList.size() - 1);
        assertThat(testVtopic.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testVtopic.getVtopictitle()).isEqualTo(DEFAULT_VTOPICTITLE);
        assertThat(testVtopic.getVtopicdesc()).isEqualTo(DEFAULT_VTOPICDESC);

        // Validate the Vtopic in Elasticsearch
        verify(mockVtopicSearchRepository, times(1)).save(testVtopic);
    }

    @Test
    @Transactional
    public void createVtopicWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = vtopicRepository.findAll().size();

        // Create the Vtopic with an existing ID
        vtopic.setId(1L);
        VtopicDTO vtopicDTO = vtopicMapper.toDto(vtopic);

        // An entity with an existing ID cannot be created, so this API call must fail
        restVtopicMockMvc.perform(post("/api/vtopics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vtopicDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Vtopic in the database
        List<Vtopic> vtopicList = vtopicRepository.findAll();
        assertThat(vtopicList).hasSize(databaseSizeBeforeCreate);

        // Validate the Vtopic in Elasticsearch
        verify(mockVtopicSearchRepository, times(0)).save(vtopic);
    }

    @Test
    @Transactional
    public void checkCreationDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = vtopicRepository.findAll().size();
        // set the field null
        vtopic.setCreationDate(null);

        // Create the Vtopic, which fails.
        VtopicDTO vtopicDTO = vtopicMapper.toDto(vtopic);

        restVtopicMockMvc.perform(post("/api/vtopics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vtopicDTO)))
            .andExpect(status().isBadRequest());

        List<Vtopic> vtopicList = vtopicRepository.findAll();
        assertThat(vtopicList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkVtopictitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = vtopicRepository.findAll().size();
        // set the field null
        vtopic.setVtopictitle(null);

        // Create the Vtopic, which fails.
        VtopicDTO vtopicDTO = vtopicMapper.toDto(vtopic);

        restVtopicMockMvc.perform(post("/api/vtopics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vtopicDTO)))
            .andExpect(status().isBadRequest());

        List<Vtopic> vtopicList = vtopicRepository.findAll();
        assertThat(vtopicList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllVtopics() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        // Get all the vtopicList
        restVtopicMockMvc.perform(get("/api/vtopics?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vtopic.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].vtopictitle").value(hasItem(DEFAULT_VTOPICTITLE.toString())))
            .andExpect(jsonPath("$.[*].vtopicdesc").value(hasItem(DEFAULT_VTOPICDESC.toString())));
    }
    
    @Test
    @Transactional
    public void getVtopic() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        // Get the vtopic
        restVtopicMockMvc.perform(get("/api/vtopics/{id}", vtopic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(vtopic.getId().intValue()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()))
            .andExpect(jsonPath("$.vtopictitle").value(DEFAULT_VTOPICTITLE.toString()))
            .andExpect(jsonPath("$.vtopicdesc").value(DEFAULT_VTOPICDESC.toString()));
    }

    @Test
    @Transactional
    public void getAllVtopicsByCreationDateIsEqualToSomething() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        // Get all the vtopicList where creationDate equals to DEFAULT_CREATION_DATE
        defaultVtopicShouldBeFound("creationDate.equals=" + DEFAULT_CREATION_DATE);

        // Get all the vtopicList where creationDate equals to UPDATED_CREATION_DATE
        defaultVtopicShouldNotBeFound("creationDate.equals=" + UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    public void getAllVtopicsByCreationDateIsInShouldWork() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        // Get all the vtopicList where creationDate in DEFAULT_CREATION_DATE or UPDATED_CREATION_DATE
        defaultVtopicShouldBeFound("creationDate.in=" + DEFAULT_CREATION_DATE + "," + UPDATED_CREATION_DATE);

        // Get all the vtopicList where creationDate equals to UPDATED_CREATION_DATE
        defaultVtopicShouldNotBeFound("creationDate.in=" + UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    public void getAllVtopicsByCreationDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        // Get all the vtopicList where creationDate is not null
        defaultVtopicShouldBeFound("creationDate.specified=true");

        // Get all the vtopicList where creationDate is null
        defaultVtopicShouldNotBeFound("creationDate.specified=false");
    }

    @Test
    @Transactional
    public void getAllVtopicsByVtopictitleIsEqualToSomething() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        // Get all the vtopicList where vtopictitle equals to DEFAULT_VTOPICTITLE
        defaultVtopicShouldBeFound("vtopictitle.equals=" + DEFAULT_VTOPICTITLE);

        // Get all the vtopicList where vtopictitle equals to UPDATED_VTOPICTITLE
        defaultVtopicShouldNotBeFound("vtopictitle.equals=" + UPDATED_VTOPICTITLE);
    }

    @Test
    @Transactional
    public void getAllVtopicsByVtopictitleIsInShouldWork() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        // Get all the vtopicList where vtopictitle in DEFAULT_VTOPICTITLE or UPDATED_VTOPICTITLE
        defaultVtopicShouldBeFound("vtopictitle.in=" + DEFAULT_VTOPICTITLE + "," + UPDATED_VTOPICTITLE);

        // Get all the vtopicList where vtopictitle equals to UPDATED_VTOPICTITLE
        defaultVtopicShouldNotBeFound("vtopictitle.in=" + UPDATED_VTOPICTITLE);
    }

    @Test
    @Transactional
    public void getAllVtopicsByVtopictitleIsNullOrNotNull() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        // Get all the vtopicList where vtopictitle is not null
        defaultVtopicShouldBeFound("vtopictitle.specified=true");

        // Get all the vtopicList where vtopictitle is null
        defaultVtopicShouldNotBeFound("vtopictitle.specified=false");
    }

    @Test
    @Transactional
    public void getAllVtopicsByVtopicdescIsEqualToSomething() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        // Get all the vtopicList where vtopicdesc equals to DEFAULT_VTOPICDESC
        defaultVtopicShouldBeFound("vtopicdesc.equals=" + DEFAULT_VTOPICDESC);

        // Get all the vtopicList where vtopicdesc equals to UPDATED_VTOPICDESC
        defaultVtopicShouldNotBeFound("vtopicdesc.equals=" + UPDATED_VTOPICDESC);
    }

    @Test
    @Transactional
    public void getAllVtopicsByVtopicdescIsInShouldWork() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        // Get all the vtopicList where vtopicdesc in DEFAULT_VTOPICDESC or UPDATED_VTOPICDESC
        defaultVtopicShouldBeFound("vtopicdesc.in=" + DEFAULT_VTOPICDESC + "," + UPDATED_VTOPICDESC);

        // Get all the vtopicList where vtopicdesc equals to UPDATED_VTOPICDESC
        defaultVtopicShouldNotBeFound("vtopicdesc.in=" + UPDATED_VTOPICDESC);
    }

    @Test
    @Transactional
    public void getAllVtopicsByVtopicdescIsNullOrNotNull() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        // Get all the vtopicList where vtopicdesc is not null
        defaultVtopicShouldBeFound("vtopicdesc.specified=true");

        // Get all the vtopicList where vtopicdesc is null
        defaultVtopicShouldNotBeFound("vtopicdesc.specified=false");
    }

    @Test
    @Transactional
    public void getAllVtopicsByVquestionIsEqualToSomething() throws Exception {
        // Initialize the database
        Vquestion vquestion = VquestionResourceIntTest.createEntity(em);
        em.persist(vquestion);
        em.flush();
        vtopic.addVquestion(vquestion);
        vtopicRepository.saveAndFlush(vtopic);
        Long vquestionId = vquestion.getId();

        // Get all the vtopicList where vquestion equals to vquestionId
        defaultVtopicShouldBeFound("vquestionId.equals=" + vquestionId);

        // Get all the vtopicList where vquestion equals to vquestionId + 1
        defaultVtopicShouldNotBeFound("vquestionId.equals=" + (vquestionId + 1));
    }


    @Test
    @Transactional
    public void getAllVtopicsByUserIsEqualToSomething() throws Exception {
        // Initialize the database
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        em.flush();
        vtopic.setUser(user);
        vtopicRepository.saveAndFlush(vtopic);
        Long userId = user.getId();

        // Get all the vtopicList where user equals to userId
        defaultVtopicShouldBeFound("userId.equals=" + userId);

        // Get all the vtopicList where user equals to userId + 1
        defaultVtopicShouldNotBeFound("userId.equals=" + (userId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned
     */
    private void defaultVtopicShouldBeFound(String filter) throws Exception {
        restVtopicMockMvc.perform(get("/api/vtopics?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vtopic.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].vtopictitle").value(hasItem(DEFAULT_VTOPICTITLE.toString())))
            .andExpect(jsonPath("$.[*].vtopicdesc").value(hasItem(DEFAULT_VTOPICDESC.toString())));

        // Check, that the count call also returns 1
        restVtopicMockMvc.perform(get("/api/vtopics/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned
     */
    private void defaultVtopicShouldNotBeFound(String filter) throws Exception {
        restVtopicMockMvc.perform(get("/api/vtopics?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restVtopicMockMvc.perform(get("/api/vtopics/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingVtopic() throws Exception {
        // Get the vtopic
        restVtopicMockMvc.perform(get("/api/vtopics/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateVtopic() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        int databaseSizeBeforeUpdate = vtopicRepository.findAll().size();

        // Update the vtopic
        Vtopic updatedVtopic = vtopicRepository.findById(vtopic.getId()).get();
        // Disconnect from session so that the updates on updatedVtopic are not directly saved in db
        em.detach(updatedVtopic);
        updatedVtopic
            .creationDate(UPDATED_CREATION_DATE)
            .vtopictitle(UPDATED_VTOPICTITLE)
            .vtopicdesc(UPDATED_VTOPICDESC);
        VtopicDTO vtopicDTO = vtopicMapper.toDto(updatedVtopic);

        restVtopicMockMvc.perform(put("/api/vtopics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vtopicDTO)))
            .andExpect(status().isOk());

        // Validate the Vtopic in the database
        List<Vtopic> vtopicList = vtopicRepository.findAll();
        assertThat(vtopicList).hasSize(databaseSizeBeforeUpdate);
        Vtopic testVtopic = vtopicList.get(vtopicList.size() - 1);
        assertThat(testVtopic.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testVtopic.getVtopictitle()).isEqualTo(UPDATED_VTOPICTITLE);
        assertThat(testVtopic.getVtopicdesc()).isEqualTo(UPDATED_VTOPICDESC);

        // Validate the Vtopic in Elasticsearch
        verify(mockVtopicSearchRepository, times(1)).save(testVtopic);
    }

    @Test
    @Transactional
    public void updateNonExistingVtopic() throws Exception {
        int databaseSizeBeforeUpdate = vtopicRepository.findAll().size();

        // Create the Vtopic
        VtopicDTO vtopicDTO = vtopicMapper.toDto(vtopic);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVtopicMockMvc.perform(put("/api/vtopics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vtopicDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Vtopic in the database
        List<Vtopic> vtopicList = vtopicRepository.findAll();
        assertThat(vtopicList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Vtopic in Elasticsearch
        verify(mockVtopicSearchRepository, times(0)).save(vtopic);
    }

    @Test
    @Transactional
    public void deleteVtopic() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);

        int databaseSizeBeforeDelete = vtopicRepository.findAll().size();

        // Get the vtopic
        restVtopicMockMvc.perform(delete("/api/vtopics/{id}", vtopic.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Vtopic> vtopicList = vtopicRepository.findAll();
        assertThat(vtopicList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Vtopic in Elasticsearch
        verify(mockVtopicSearchRepository, times(1)).deleteById(vtopic.getId());
    }

    @Test
    @Transactional
    public void searchVtopic() throws Exception {
        // Initialize the database
        vtopicRepository.saveAndFlush(vtopic);
        when(mockVtopicSearchRepository.search(queryStringQuery("id:" + vtopic.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(vtopic), PageRequest.of(0, 1), 1));
        // Search the vtopic
        restVtopicMockMvc.perform(get("/api/_search/vtopics?query=id:" + vtopic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vtopic.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].vtopictitle").value(hasItem(DEFAULT_VTOPICTITLE)))
            .andExpect(jsonPath("$.[*].vtopicdesc").value(hasItem(DEFAULT_VTOPICDESC)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vtopic.class);
        Vtopic vtopic1 = new Vtopic();
        vtopic1.setId(1L);
        Vtopic vtopic2 = new Vtopic();
        vtopic2.setId(vtopic1.getId());
        assertThat(vtopic1).isEqualTo(vtopic2);
        vtopic2.setId(2L);
        assertThat(vtopic1).isNotEqualTo(vtopic2);
        vtopic1.setId(null);
        assertThat(vtopic1).isNotEqualTo(vtopic2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(VtopicDTO.class);
        VtopicDTO vtopicDTO1 = new VtopicDTO();
        vtopicDTO1.setId(1L);
        VtopicDTO vtopicDTO2 = new VtopicDTO();
        assertThat(vtopicDTO1).isNotEqualTo(vtopicDTO2);
        vtopicDTO2.setId(vtopicDTO1.getId());
        assertThat(vtopicDTO1).isEqualTo(vtopicDTO2);
        vtopicDTO2.setId(2L);
        assertThat(vtopicDTO1).isNotEqualTo(vtopicDTO2);
        vtopicDTO1.setId(null);
        assertThat(vtopicDTO1).isNotEqualTo(vtopicDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(vtopicMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(vtopicMapper.fromId(null)).isNull();
    }
}
