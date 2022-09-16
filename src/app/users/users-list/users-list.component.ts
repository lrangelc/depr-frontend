import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/services/users/users.service';

@Component({
  selector: 'fury-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.usersService
    .getUsers()
    .subscribe(
      (response: any) => {
        console.log(response);
        // if (response.success) {
        //   this.usersService.setUser(response.data);
        //   this.router.navigate(["/"]);
        //   this.snackbar.open(
        //     `Welcome ${response.data.nickname ?? response.data.name}!`,
        //     "Bank System",
        //     {
        //       duration: 10000,
        //     }
        //   );
        // }
      },
      (err) => {
        console.error(err);
      }
    );
  }

}
