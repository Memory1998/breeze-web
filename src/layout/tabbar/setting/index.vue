<template>
  <div class="setting">
    <div class="btn-group">
      <!-- TODO -->
      <div class="btn">
        <Icon :icon-name="iconClass" style="cursor: pointer;" @click.native="handleScreenFull"/>
      </div>

      <div class="btn">
        <el-badge :is-dot="this.$store.getters['msg/getMsg'].length > 0">
          <i class="el-icon-message-solid" style="cursor: pointer;" @click="showMsgBox"></i>
        </el-badge>
      </div>

      <div class="btn">
        <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <span class="login-name" style="font-size: 0.99rem"> {{ this.currentLoginName }} </span>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setting">
              <i class="el-icon-setting"/>平台设置
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              <i class="el-icon-switch-button"/>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- setting -->
    <el-drawer
      :direction="direction"
      :visible.sync="settingDrawer"
      title="平台设置">
      <el-main class="setting-drawer">
        <el-row>
          <el-col :md="4"> 选项卡：</el-col>
          <el-col :md="20">
            <el-radio-group v-model="settingData.cardType">
              <el-radio v-for="(item, index) in settings.cardTypeList" :key="index" :label="item.label"
                        @change="handleChangeType">
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="4"> 主题：</el-col>
          <el-col :md="20">
            <el-radio-group v-model="settingData.theme">
              <el-radio v-for="(item, index) in settings.themeList" :key="index" :label="item.label"
                        @change="handleChangeTheme">
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="4">
          </el-col>
          <el-col :md="20">
          </el-col>
        </el-row>
      </el-main>
    </el-drawer>

    <!-- 消息-->
    <el-drawer
      :direction="direction"
      :size="'20%'"
      :visible.sync="msgDrawer"
      :with-header="false">
      <el-main>
        <transition v-for="(item , index) in this.getMsg" :key="index" :index="index" name="el-fade-in">
          <div class="msg-content">
            <div
              :style="{ color: item.level === 'info' ? '#909399' :
                          (item.level === 'warning'? '#E6A23C' :
                                  (item.level === 'danger'? '#F56C6C':'#67C23A'))}"
              class="msg-title">
              {{ item.title }}
            </div>
            <div class="msg">
              <h1 class="msg-cursor"> 查看详情 </h1>
              <h1 class="msg-cursor" @click="closeMsg(item)"> 关闭 </h1>
              <h1 class="msg-cursor" @click="markReadMsg (item)"> 已读 </h1>
            </div>
          </div>
        </transition>
      </el-main>
    </el-drawer>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import screenfull from 'screenfull'

export default {
  name: 'Setting',
  data () {
    return {
      currentLoginName: '',
      settingDrawer: false,
      msgDrawer: false,
      iconClass: '',
      direction: 'rtl',
      settingData: {
        cardType: '',
        theme: ''
      },
      settings: {
        cardTypeList: [
          {
            label: 'tab',
            name: '选项卡式'
          },
          {
            label: 'tag',
            name: '标签式'
          }
        ],
        themeList: [
          {
            label: 'simple',
            name: '简约'
          },
          {
            label: 'default',
            name: '默认'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('msg', ['getMsg'])
  },
  mounted () {
    console.log('去获取登录用户')
    // 获取当前你登录用户
    this.currentLoginName = this.getLoginName()
  },
  created () {
    this.iconClass = 'icon-quanpingxianshi'
    this.settingData.cardType = this.$store.getters['settings/getType']
    this.settingData.theme = this.$store.getters['settings/getTheme']
    // 初始化消息
    this.reloadMsg().then(r => console.debug(r))
  },
  methods: {
    ...mapActions('msg', ['closeMsgCard', 'markReadMsgCard', 'reloadMsg']),
    ...mapActions('userInfo', ['clearUserInfo']),
    ...mapMutations('menu', ['setMenuCollapse', 'clearMenus']),
    ...mapMutations('settings', ['setType', 'setTheme']),
    ...mapGetters('userInfo', ['getLoginName']),
    handleChangeTheme () {
      this.setTheme(this.settingData.theme)
    },
    handleChangeType () {
      this.setType(this.settingData.cardType)
    },
    screenFull () {
      if (!screenfull.isEnabled) {
        this.$message({
          message: '你的浏览器不支持全屏',
          type: 'warning'
        })
        return
      }
      if (screenfull.isFullscreen) {
        this.iconClass = 'icon-quanpingxianshi'
      } else {
        this.iconClass = 'icon-quanpingsuoxiao'
      }
      screenfull.toggle()
    },
    handleScreenFull () {
      this.screenFull()
    },
    /**
     *
     * @param command
     */
    handleCommand (command) {
      if (command === 'logout') {
        this.$confirm('确定注销并退出系统', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('userInfo/logOut').then(() => {
            if (process.env.NODE_ENV === 'production') {
              location.href = 'TODO'
              return
            }
            location.href = '/'
          })
        }).catch(() => {
        })
        return
      }
      this.settingDrawer = true
    },
    /**
     * 关闭消息
     *
     * @param msg
     */
    closeMsg (msg) {
      this.closeMsgCard(msg)
    },
    /**
     * 标记已读
     *
     * @param msg
     */
    markReadMsg (msg) {
      this.markReadMsgCard(msg)
    },
    showMsgBox () {
      this.msgDrawer = true
      // TODO 可采用长连接
      this.reloadMsg().then(r => console.debug(r))
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: space-between;

  > .btn-group {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 10px;
    height: 100%;

    > .btn {
      margin: 0 5px;
    }

    .login-name {
      display: block;
      width: 70px;
      text-overflow: ellipsis; /* 溢出用省略号*/
      overflow: hidden; /**超出的文本隐藏 */
      white-space: nowrap; /** 溢出不换行 */
    }
  }

  .setting-drawer {

  }

  //--- todo
  .msg-content {
    height: 11vh;
    padding: 14px 26px 14px 13px;
    margin-top: 14px;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid #EBEEF5;
    background-color: #FFFFFF;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: opacity .3s, transform .3s, left .3s, right .3s, top .4s, bottom .3s;
    overflow: hidden;

    .msg-title {
      line-height: 1;
      white-space: nowrap;
      box-sizing: border-box;
      outline: 0;
      display: block;
      font-weight: bolder;
      padding: 6px 13px;
      font-size: 1rem;
      border-radius: 3px;
    }

    .msg {
      width: 100vw;
      display: flex;
      justify-items: center;
      align-items: center;
      font-weight: 500;

      .msg-cursor {
        cursor: pointer;
        padding: 3px 13px;
        margin-top: 30px;
        font-size: 0.5rem;
      }
    }
  }
}
</style>
