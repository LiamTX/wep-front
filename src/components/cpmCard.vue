<template>
  <div>
    <v-card
      v-if="cardData"
      class="rounded-xl ac mb-5"
      max-height="900px"
      max-width="600px"
    >
      <v-app-bar color="white" class="d-flex align-center" dense>
        <v-avatar size="36" color="orange" class="mr-3">
          <v-icon v-if="!cardData.user.avatar" dark>mdi-account-circle</v-icon>
          <img v-else :src="cardData.user.avatar" alt="avatar" />
        </v-avatar>

        |

        <div class="ml-3">{{ cardData.user.name }}</div>

        <div class="ml-3">{{ cardData.eventDate }}</div>
      </v-app-bar>

      <v-img
        contain
        max-width="600px"
        max-height="600px"
        :src="cardData.img"
      ></v-img>

      <v-card-title>
        <h2>{{ cardData.title }}</h2>
      </v-card-title>

      <v-card-text>
        <p>{{ cardData.description }}</p>
      </v-card-text>

      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>Comentários</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>
              <div
                class="d-flex mt-4"
                v-for="comment in cardData.comments"
                :key="comment.id"
              >

                <v-avatar size="33" color="orange" class="mr-4">
                  <v-icon v-if="!comment.user.avatar" dark
                    >mdi-account-circle</v-icon
                  >
                  <img v-else :src="comment.user.avatar" alt="avatar" />
                </v-avatar>

                {{ comment.user.name }} - 

                <span class="ml-2" v-if="selectedCommentId != comment.id">
                    {{ comment.comment }}
                </span>

                <span class="ml-2" v-if="selectedCommentId == comment.id && !setUpdateinput">
                    {{ comment.comment }}
                </span>

                <div class="d-flex" v-if="setUpdateinput">
                    
                    <v-text-field
                        class="ml-3"
                        v-if="selectedCommentId == comment.id"
                        v-model="updateInputComment"
                        :counter="500"
                        label="First name"
                        outlined
                    ></v-text-field>

                        <div>
                            <v-icon v-if="selectedCommentId == comment.id" color="error" class="d-block" @click="setUpdateinput = false">
                                mdi-close
                            </v-icon>
        
                            <v-icon v-if="selectedCommentId == comment.id" color="primary" @click="sendUpdateComment(comment)">
                                mdi-send-circle-outline
                            </v-icon>
                        </div>

                </div>
                
                <v-menu
                    v-if="comment.user.id == userData.id"
                    offset-x
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        color="primary"
                        dark
                        class="ml-a"
                        text
                        v-bind="attrs"
                        v-on="on"
                        >
                            <v-icon>mdi-buffer</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item
                        v-for="(item, index) in commentOptions"
                        :key="index"
                        link
                        >
                        <v-list-item-title @click="commentAction(item, comment)">
                            {{ item.name }} <v-icon dark :color="item.color">{{ item.icon }}</v-icon>
                        </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                
              </div>

            </div>

            <div class="mt-5">
              <div class="d-flex">
                <v-avatar size="47" color="orange" class="mr-4">
                  <v-icon v-if="!userData.avatar" dark
                    >mdi-account-circle</v-icon
                  >
                  <img v-else :src="userData.avatar" alt="avatar" />
                </v-avatar>

                <v-textarea
                  outlined
                  v-model="newComent"
                  class="text-area-coment"
                  :counter="500"
                  auto-grow
                  filled
                  color="black"
                  label="Comente no evento 🗯"
                  rows="1"
                ></v-textarea>
              </div>

              <div class="d-flex justify-space-between">
                <v-btn
                  color="orange"
                  dark
                  class="ml-a"
                  @click="createComent(cardData)"
                >
                  Enviar
                </v-btn>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Card",
  props: ["cardData"],
  data: () => ({
    // cardDataArray: [],
    newComent: "",
    updateInputComment: "",
    selectedCommentId: "",
    setUpdateinput: false,
    url: process.env.VUE_APP_BASE_URL,
    commentOptions: [
        {name: "Editar", icon:"mdi-pencil", color:"orange"}, 
        {name: "Deletar", icon:"mdi-trash-can", color:"error"}
    ]
  }),

  computed: {
    ...mapGetters({
      userData: "FeedVuex/userData",
    }),
  },

  methods: {
        ...mapActions({
            getEvents: 'FeedVuex/getEvents'
        }),

        createComent(param) {
        if (!this.newComent) {
            this.$toast.error("Verifique se existe algum campo vazio", "Atenção!", {
            position: "topCenter",
            });
        } else {
            let body = {
            comment: this.newComent,
            };
            let eventId = param.id;

            // this.$http.post(this.url + `/comment/${eventId}`, body).then(resp => {
            //     console.log(resp)
            // })

            axios
            .post(this.url + `/comment/${eventId}`, body)
            .then((resp) => {

                if(resp.data != ''){
                    this.getEvents()
                    this.newComent = ''

                    this.$toast.success("evento comentado!", "💥", {
                        position: "topCenter",
                    });
                }
            })
            .catch((err) => {
                this.$toast.error("Erro ao tentar comentar no evento!", "Putz", {
                position: "topCenter",
                });
            });
        }
        },

        sendUpdateComment(comentData){

            let comentId = comentData.id
            let body = {
                comment:this.updateInputComment
            }
            axios.put(this.url + `/comment/${comentId}`, body)
            .then(resp => {
                console.log(resp)
                if(resp.data != ''){
                    this.getEvents()
                    this.setUpdateinput = false
                    this.$toast.success("Comentário alterado", "💥", {
                        position: "topCenter",
                    });
                }
            })
            .catch((err) => {
                this.$toast.error("Erro ao tentar alterar comentário!", "Putz", {
                position: "topCenter",
                });
            });
        },

        commentAction(param, comentID){
            console.log(param)
            if(param.name == "Editar"){
                this.updateComment(comentID)
            }else if(param.name == "Deletar"){
                this.deleteComment(comentID)
            }
        },
        updateComment(comentParam){
            console.log(comentParam.id)
            this.selectedCommentId = comentParam.id
            this.setUpdateinput = true
        },
        deleteComment(comentParam){

            let comentId = comentParam.id
            axios.delete(this.url + `/comment/${comentId}`)
            .then(resp => {
                console.log(resp)
                if(resp.data != ''){
                    this.getEvents()

                    this.$toast.success("Comentário deletado", "💥", {
                        position: "topCenter",
                    });
                }
            })
            .catch((err) => {
                this.$toast.error("Erro ao tentar deletar comentário!", "Putz", {
                position: "topCenter",
                });
            });

        },
  },

  created() {
  },
};
</script>

<style lang="scss">
.text-area-coment {
}
</style>