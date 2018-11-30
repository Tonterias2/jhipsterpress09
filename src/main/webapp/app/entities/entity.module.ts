import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { JhipsterpressBlogModule } from './blog/blog.module';
import { JhipsterpressPostModule } from './post/post.module';
import { JhipsterpressTopicModule } from './topic/topic.module';
import { JhipsterpressTagModule } from './tag/tag.module';
import { JhipsterpressCommentModule } from './comment/comment.module';
import { JhipsterpressCmessageModule } from './cmessage/cmessage.module';
import { JhipsterpressMessageModule } from './message/message.module';
import { JhipsterpressNotificationModule } from './notification/notification.module';
import { JhipsterpressUprofileModule } from './uprofile/uprofile.module';
import { JhipsterpressCommunityModule } from './community/community.module';
import { JhipsterpressFollowModule } from './follow/follow.module';
import { JhipsterpressBlockuserModule } from './blockuser/blockuser.module';
import { JhipsterpressAlbumModule } from './album/album.module';
import { JhipsterpressCalbumModule } from './calbum/calbum.module';
import { JhipsterpressPhotoModule } from './photo/photo.module';
import { JhipsterpressInterestModule } from './interest/interest.module';
import { JhipsterpressActivityModule } from './activity/activity.module';
import { JhipsterpressCelebModule } from './celeb/celeb.module';
import { JhipsterpressCinterestModule } from './cinterest/cinterest.module';
import { JhipsterpressCactivityModule } from './cactivity/cactivity.module';
import { JhipsterpressCcelebModule } from './cceleb/cceleb.module';
import { JhipsterpressUrllinkModule } from './urllink/urllink.module';
import { JhipsterpressFrontpageconfigModule } from './frontpageconfig/frontpageconfig.module';
import { JhipsterpressVtopicModule } from './vtopic/vtopic.module';
import { JhipsterpressVquestionModule } from './vquestion/vquestion.module';
import { JhipsterpressVanswerModule } from './vanswer/vanswer.module';
import { JhipsterpressVthumbModule } from './vthumb/vthumb.module';
import { JhipsterpressNewsletterModule } from './newsletter/newsletter.module';
import { JhipsterpressFeedbackModule } from './feedback/feedback.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        JhipsterpressBlogModule,
        JhipsterpressPostModule,
        JhipsterpressTopicModule,
        JhipsterpressTagModule,
        JhipsterpressCommentModule,
        JhipsterpressCmessageModule,
        JhipsterpressMessageModule,
        JhipsterpressNotificationModule,
        JhipsterpressUprofileModule,
        JhipsterpressCommunityModule,
        JhipsterpressFollowModule,
        JhipsterpressBlockuserModule,
        JhipsterpressAlbumModule,
        JhipsterpressCalbumModule,
        JhipsterpressPhotoModule,
        JhipsterpressInterestModule,
        JhipsterpressActivityModule,
        JhipsterpressCelebModule,
        JhipsterpressCinterestModule,
        JhipsterpressCactivityModule,
        JhipsterpressCcelebModule,
        JhipsterpressUrllinkModule,
        JhipsterpressFrontpageconfigModule,
        JhipsterpressVtopicModule,
        JhipsterpressVquestionModule,
        JhipsterpressVanswerModule,
        JhipsterpressVthumbModule,
        JhipsterpressNewsletterModule,
        JhipsterpressFeedbackModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterpressEntityModule {}
