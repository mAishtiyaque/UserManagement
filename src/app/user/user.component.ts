import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent {
    userData: any = [];
    isEditing:boolean[]=[];
    temp: any={users:[]};
    statusText:string='';
    status_class:string='';
    constructor(private userServices: UsersService) { }
    fetchAllUsers() {
        this.userServices.fetchAllUsers('?limit=5')
            .subscribe(result => {
                this.temp = result;
                this.userData=this.temp.users
                this.isEditing = new Array(this.temp.users.length).fill(false);
                //console.log(result)
            })
    }
    isDocChange: boolean = false;
    addNewUser(txt: string) {
        if (txt !== '') {
            const spidx=txt.lastIndexOf(' ');
            this.isEditing.push(false);
            this.userServices.addNewUser(txt.substring(0, spidx), txt.substring( spidx+ 1))
            .subscribe(result =>{
                this.userData.push(result)
                this.setStatusText("User added Successfully",'added');
        })
            this.isDocChange = true;
        }
    }
    removeUser(id: number) {
        this.userData = this.userData.filter((item: any) => item.id != id)
        this.userServices.removeUser(id)
            .subscribe(result =>{
                console.log("Deleted ",result) 
                // error for newly created user due api limitation (drop new user added i.e no new id).
                this.setStatusText("User deleted Successfully",'deleted');
        })
        this.isDocChange = true;
    }
    editUser(id: number, txt: string) {
        let idx = this.userData.findIndex((item: { id: number, text: string, isEditing: boolean }) => item.id === id);
        if (this.isEditing[idx]) {
            const spidx=txt.lastIndexOf(' ');
            this.userData[idx].firstName = txt.substring(0, spidx);
            this.userData[idx].lastName = txt.substring( spidx+ 1);
            this.isEditing[idx] = false;
            this.isDocChange = true;
            this.userServices.updateUser(txt.substring(0, spidx),txt.substring( spidx+ 1),id)
            .subscribe(result =>{
                console.log("Updated ",result) 
                // error for newly created user due api limitation (drop new user added i.e no new id).
                this.setStatusText("Updated Successfully",'updated');
            })}
        else {
            this.isEditing[idx] = true;
        }
    }
    setStatusText(text:string,status_class_name=''){
        this.status_class=status_class_name;
        this.statusText=text;
        setTimeout(()=>{
            this.statusText='';
            this.status_class="";
        },3500);
    }
    ngOnInit() {
        this.fetchAllUsers()
        // Below code for localStorage 
        // if ("ngUserData" in localStorage) {
        //     // let temp: any = localStorage.getItem('ngUserData');
        //     // this.userData = JSON.parse(temp);
        // }
        // setInterval(() => {
        //     if (this.isDocChange) {
        //         //saave
        //         localStorage.setItem('ngUserData', JSON.stringify(this.userData));
        //         //console.log('saved!');
        //         this.isDocChange = false;
        //     }
        // }, 5000);
    }
}
