import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user';
import { Contactmail } from '../../shared/models/contactmail';
import { MailService } from '../../shared/services/mail.service';
import { AccountService } from 'src/app/shared/services/account.service';
import { take } from 'rxjs';
import { Toast } from '@capacitor/toast';
import { NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.page.html',
    styleUrls: ['./contact.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
    ],
})
export class ContactPage implements OnInit {
  readyToSend = false;
  waitMilliseconds = 2000;
  busy = false;
  alerts: any[] = [{}];

  user: User | undefined;

  contactMail!: Contactmail;
  templateName = 'contact.html';
  mailSubject: string | undefined;
  templateBody!: string;

  form!: FormGroup;
  urlEmail!: string | undefined;
  urlName!: string | undefined;
  urlPhone!: string | undefined;
  urlRr!: string | undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    private aService: AccountService,
    private fb: FormBuilder,
    private ms: MailService,
    private ts: TranslateService
  ) {
    this.aService.currentUser$.pipe(take(1)).subscribe({
      next: (result) => {
        this.user = result as User;
        this.urlEmail = this.user.email;
        this.urlName = this.user.knownAs;
        this.urlPhone = this.user.phoneNumber;
        this.urlRr = this.user.berNumber;
      },
    });
    this.aService.setLoading(false);
  }

  ngOnInit() {
    this.initTemplate();
    this.ts.get('CONTACT.MessageAlert').subscribe((value) => {
      const showAlert = async () => {
        await Toast.show({
          text: value,
        });
      };
      showAlert();
    });
  }

  initTemplate() {
    this.http
      .get('assets/templates/mail/' + this.templateName, {
        responseType: 'text',
      })
      .subscribe((data) => {
        // console.log(data);
        this.templateBody = data;
        this.createContactForm();
      });
  }

  createContactForm() {
    this.ts.get('CONTACT.MessageSubject').subscribe((value) => {
      this.mailSubject = value;
    });

    this.form = this.fb.group({
      subject: [this.mailSubject, Validators.required],
      name: [this.urlName, Validators.required],
      rR: [
        this.urlRr,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      email: [
        this.urlEmail,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ]),
      ],
      phone: [this.urlPhone],
      copySender: [false],
      message: ['', Validators.required],
      template: [this.templateBody],
      data: [null],
      apiGuid: [environment.apiVsoftMailGuid, Validators.required],
      apiMailKey: [environment.apiVsoftSendFromAddress, Validators.required],
      apiNameKey: [environment.apiVsoftSendFromName, Validators.required],
    });
    // console.log(this.form.value);
  }

  refreshTemplateBody() {
    const stringNameToReplace = '.{name}';
    // name insert
    this.templateBody = this.templateBody.replace(
      stringNameToReplace,
      this.form.value.name
    );

    const stringInBlockToReplace = '.{message}';
    // name insert
    this.templateBody = this.templateBody.replace(
      stringInBlockToReplace,
      this.form.value.message
    );

    this.form.value.template = this.templateBody;
    // console.log(this.form.value);
  }

  checkBeforeSending() {
    this.readyToSend = true;
  }

  backToEditing() {
    this.readyToSend = false;
  }

  submitContactMail() {
    // console.log(this.form.value);
    this.refreshTemplateBody();
    // console.log(this.form.value);

    this.contactMail = Object.assign({}, this.form.value);
    // console.log(this.contactMail);
    this.busy = true;
    this.ms.contactmail(this.contactMail).subscribe({
      next: () => {
        this.ts.get('CONTACT.SendSuccessMessage').subscribe((res: string) => {
          const showSuccess = async () => {
            await Toast.show({
              text: res,
            });
          };
          showSuccess();
          this.busy = false;
        });
      },
      error: () => {
        this.ts.get('CONTACT.SendFailedMessage').subscribe((res: string) => {
          const showFailed = async () => {
            await Toast.show({
              text: res,
            });
          };
          showFailed();
          this.busy = false;
        });
      },
      complete: () => {
        this.router.navigate(['/user']);
        /* setTimeout(() => {
          this.router.navigate(['/home']);
        }, this.waitMilliseconds); */
      },
    });
  }
}
