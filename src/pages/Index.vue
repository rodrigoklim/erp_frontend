<template>
  <q-page class="flex">
    <div class="row fit justify-center items-center content-start">
      <div class="col-11 q-mt-md">
        <q-card
          dark
          class="full-width"
          style="border-radius: 2em; overflow: inherit !important; color:white; opacity:0.75; font-family: poppins; font-weight: 200"
        >
          <q-card-section>
            <div class="row">
              <div class="col">
                <div class="text-h4">Tarefas</div>
              </div>
              <div class="col">
                <div class="row justify-end">
                  <q-btn
                    flat
                    no-caps
                    icon="add_task"
                    label="Nova Tarefa"
                    @click="newTaskDialog = !newTaskDialog"
                  />
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator
            dark
            inset
          />
          <q-card-section>
            <q-table
              :dense="$q.screen.lt.md"
              :data="tasks"
              :columns="columns"
              row-key="name"
              dark
              color="amber"
              style="color:white; opacity:0.95; font-family: poppins; font-weight: 300;"
              :loading="visible"
            >
              <template v-slot:body-cell-created_at="props">
                <q-td :props="props">
                  {{dateFilter(props.row.created_at)}}
                </q-td>
              </template>
              <template v-slot:body-cell-endTask="props">
                <q-td :props="props">
                  <q-btn
                    @click="endTaskBtn(props.row.id)"
                    label="Terminar Tarefa"
                    style="background-color: #757575"
                  />
                </q-td>
              </template>
              <template v-slot:loading>
                <q-inner-loading
                  showing
                  color="primary"
                />
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- nova tarefa -->
    <q-dialog
      v-model="newTaskDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        class="bg-dark text-white"
        style="width: 100%; color:white; opacity:0.95; font-family: poppins; font-weight: 300"
      >
        <q-card-section style="background-color:#292929">
          <div class="text-h6">Nova Tarefa</div>
        </q-card-section>
        <q-separator
          color="white"
          style="opacity:0.75"
        />
        <q-card-section class="q-pt-none">
          <div
            class="q-pa-md"
            style="max-width:100%"
          >
            <q-input
              v-model="newTaskText"
              filled
              dark
              type="textarea"
              placeholder="Insira a nova  tarefa"
            />
          </div>
        </q-card-section>

        <q-card-actions
          align="around"
          class="text-white"
          style="background-color: #292929"
        >
          <q-btn
            label="Cancelar"
            v-close-popup
            @click="newTaskText=''"
            color="negative"
          />
          <q-btn
            label="Enviar"
            @click="newTask()"
            style="background-color:#757575"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- finalizar tarefa -->
    <q-dialog
      v-model="endTaskDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        class="bg-warning text-white"
        style="width: 400px"
      >
        <q-card-section horizontal>
          <q-card-section>
            <q-icon
              name="warning_amber"
              style="margin:auto; font-size: 8rem"
              class="text-white"
            />
          </q-card-section>
          <q-card-section>
            <q-card-section>
              <div class="text-h6">Atenção!</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              Deseja realmente finalizar a tarefa?
            </q-card-section>
          </q-card-section>
        </q-card-section>
        <q-card-actions
          align="around"
          class="text-white"
          style="background-color: #292929"
        >
          <q-btn
            label="Cancelar"
            v-close-popup
            @click="endTaskId=''"
            color="negative"
          />
          <q-btn
            label="Finalizar"
            @click="endTask()"
            style="background-color:#757575"
            v-close-popup
          />
        </q-card-actions>

      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from 'moment'
import apiClient from '../services/api'
// Vue.use(require('vue-moment'))

export default {
  name: 'PageIndex',
  data () {
    return {
      columns: [
        { name: 'created_at', label: 'Data', align: 'center', field: 'created_at', sortable: true },
        { name: 'task', align: 'left', label: 'Tarefa', field: 'task' },
        { name: 'responsible', align: 'center', label: 'Responsável', field: 'responsible', sortable: true },
        { name: 'endTask' }
      ],
      tasks: [],
      endTaskDialog: false,
      endTaskId: '',
      newTaskDialog: false,
      newTaskText: '',
      visible: false
    }
  },
  mounted () {
    // console.log(localStorage.token)
    this.visible = true
    const self = this
    const url = '/task/show'
    const data = {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      },
      params: {
        user: localStorage.userId
      }
    }
    apiClient.get(url, data).then(response => {
      // console.log('response', response.data[0])
      self.tasks = response.data
      self.visible = false
    }).catch(error => {
      console.log('error', error)
    })
  },
  methods: {
    dateFilter (e) {
      moment.locale('pt-BR')
      return moment(e).fromNow()
    },
    endTaskBtn (e) {
      this.endTaskId = e
      this.endTaskDialog = true
    },
    endTask () {
      this.visible = true
      const self = this
      const url = '/task/end'
      const data = {
        params: {
          id: this.endTaskId
        },
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }

      apiClient.get(url, data).then(response => {
        self.visible = false
        if (response.data.msg === 'done') {
          this.$forceUpdate()
          self.tasks = response.data.tasks
        }
      }).catch(error => {
        console.log(error)
      })
    },
    newTask () {
      this.visible = true
      const self = this
      const url = '/task/new'
      const data = {
        params: {
          task: this.newTaskText,
          user: localStorage.userId
        },
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }

      apiClient.get(url, data).then(response => {
        self.visible = false
        if (response.data.msg === 'created') {
          this.$forceUpdate()
          self.tasks = response.data.tasks
        }
      }).catch(error => {
        console.log(error)
      })
    }

  }
}
</script>
